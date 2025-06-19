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
            var seedsIds = string.Join(",", seeds.Take(5));

            var client = httpClientFactory.CreateClient();

            var requestUrl = $"{_baseUrl}track/recommendation?seeds={seedsIds}&size=25&popularity=100&featureWeight=3";

            var response = await client.GetAsync(requestUrl);
            logger.LogInformation("--> Realizando requisição para api do ReccoBeat: {RequestUrl}", requestUrl);

            if (!response.IsSuccessStatusCode)
            {
                logger.LogInformation("--> Erro ao buscar recomendações: {Error}", await response.Content.ReadAsStringAsync());
                return null;
            }
            ;

            var json = await response.Content.ReadAsStringAsync();

            var pagedData = JsonSerializer.Deserialize<PageDTO>(json, _jsonSerializerOptions);
            if (pagedData?.Content == null) return [];

            var tracksId = pagedData.Content.OrderByDescending(t => t.Popularity).Take(limit).Select(track =>
            {
                return track.Href.Split("/").Last();
            });

            var tracks = await spotifyService.GetSongs(user, tracksId);

            return tracks;
        }
    }
}