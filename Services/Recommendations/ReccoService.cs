using System.Text.Json;
using Harmony.Contracts.Music;
using Harmony.Models;
using Harmony.Services.Recommendations.DTOs;
using Harmony.Services.Spotify;

namespace Harmony.Services.Recommendations
{
    public class ReccoService(IHttpClientFactory httpClientFactory, ISpotifyService spotifyService, ILogger<ReccoService> logger) : IReccoService
    {
        private readonly string _baseUrl = "https://api.reccobeats.com/v1/";

        private readonly JsonSerializerOptions _jsonSerializerOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        public async Task<List<MusicDTO>?> GetRecommendations(User user, IEnumerable<string> seeds, int limit = 5)
        {
            if (seeds == null || !seeds.Any()) return null;
            var seedsIds = string.Join(",", seeds.Take(limit));

            var client = httpClientFactory.CreateClient();

            var response = await client.GetAsync($"{_baseUrl}track/recommendation?seeds={seedsIds}&size={limit}&popularity=75");
            if (!response.IsSuccessStatusCode)
            {
                logger.LogInformation("--> Erro ao buscar recomenda��es: {Error}", await response.Content.ReadAsStringAsync());
                return null;
            }
            ;

            var json = await response.Content.ReadAsStringAsync();

            var pagedData = JsonSerializer.Deserialize<PageDTO>(json, _jsonSerializerOptions);
            if (pagedData?.Content == null) return [];

            var tracksId = pagedData.Content.Select(track =>
            {
                return track.Href.Split("/").Last();
            });

            var tracks = await spotifyService.GetSongs(user, tracksId);

            return tracks;
        }
    }
}