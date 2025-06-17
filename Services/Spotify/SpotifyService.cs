using Microsoft.AspNetCore.Identity;
using System.Net.Http.Headers;
using System.Text.Json;

using Harmony.Services.Spotify.DTOs;
using Harmony.Contracts.Music;
using Harmony.Models;

namespace Harmony.Services.Spotify
{
    public class SpotifyService(

        UserManager<User> userManager,
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory,
        ILogger<SpotifyService> logger

    ) : ISpotifyService
    {
        private readonly JsonSerializerOptions _jsonSerializerOptions = new()
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
        };

        #region Helpers

        private string GetBasicHeader()
        {
            var basicHeader = configuration["SpotifySettings:ClientId"] + ":" + configuration["SpotifySettings:ClientSecret"];
            basicHeader = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(basicHeader));
            return basicHeader;
        }

        private async Task<HttpClient?> ConfigHttpClient(User user)
        {
            var accessToken = await GetAccessToken(user);
            if (accessToken == null) return null;

            var client = httpClientFactory.CreateClient("SpotifyApi");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            return client;
        }

        public async Task<string?> GetAccessToken(User user)
        {
            if (user.Credential == null) return null;
            if (user.Credential.ExpirationDate > DateTime.UtcNow.AddMinutes(5)) return user.Credential.AccessToken;

            var client = httpClientFactory.CreateClient("SpotifyAuth");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", GetBasicHeader());

            var response = await client.PostAsync("token", new FormUrlEncodedContent(new Dictionary<string, string>
            {
                { "grant_type", "refresh_token" },
                { "refresh_token", user.Credential.RefreshToken! },
            }));

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();

                var token = JsonSerializer.Deserialize<SpotifyToken>(json, _jsonSerializerOptions);
                if (token == null) return null;

                if (token.RefreshToken != null)
                {
                    // user.Credential.RefreshToken = token.RefreshToken;
                }

                user.Credential.AccessToken = token.AccessToken;
                user.Credential.ExpirationDate = DateTime.UtcNow.AddSeconds(token.ExpiresIn);

                await userManager.UpdateAsync(user);
                return token.AccessToken;
            }
            else
            {
                logger.LogInformation("--> Erro ao pedir token de acesso: {Error}", await response.Content.ReadAsStringAsync());
                return null;
            }
        }

        public async Task<SpotifyToken?> GetToken(string authCode)
        {
            var client = httpClientFactory.CreateClient("SpotifyAuth");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", GetBasicHeader());

            var response = await client.PostAsync("token", new FormUrlEncodedContent(new Dictionary<string, string>
            {
                { "code", authCode },
                { "redirect_uri", configuration["SpotifySettings:RedirectUri"]! },
                { "grant_type", "authorization_code" },
            }));

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();

                var token = JsonSerializer.Deserialize<SpotifyToken>(json, _jsonSerializerOptions);
                return token;
            }
            else
            {
                logger.LogInformation("--> Erro ao obter tokens de Spotify: {Error}", await response.Content.ReadAsStringAsync());
                return null;
            }
        }

        #endregion

        public async Task<MusicDTO?> GetSong(User user, string id)
        {
            var client = await ConfigHttpClient(user);
            if (client == null) return null;

            var response = await client.GetAsync($"tracks/{id}");
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();

                var track = JsonSerializer.Deserialize<SpotifyTrack>(json, _jsonSerializerOptions);
                if (track == null) return null;

                return new MusicDTO
                {
                    Id = track.Id,
                    Name = track.Name,
                    Artist = track.Artists.First().Name,
                    LinkUrl = track.Uri,
                    ImageUrl = track.Album.Images.Last().Url,
                };
            }
            else
            {
                return null;
            }
        }

        public async Task<List<MusicDTO>?> GetSongs(User user, IEnumerable<string> ids)
        {
            if (ids == null || !ids.Any()) return null;

            var client = await ConfigHttpClient(user);
            if (client == null) return null;

            var tracksId = string.Join(",", ids.Take(50));

            var response = await client.GetAsync($"tracks?ids={tracksId}");
            if (!response.IsSuccessStatusCode) return null;

            var json = await response.Content.ReadAsStringAsync();
            var jsonObject = JsonDocument.Parse(json);
            var tracksData = jsonObject.RootElement.GetProperty("tracks");

            var tracks = JsonSerializer.Deserialize<List<SpotifyTrack>>(tracksData, _jsonSerializerOptions);
            if (tracks == null) return [];

            return TracksToMusics(tracks);
        }

        public async Task<ArtistDTO?> GetArtist(User user, string id)
        {
            var client = await ConfigHttpClient(user);
            if (client == null) return null;

            var response = await client.GetAsync($"artists/{id}");
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();

                var artist = JsonSerializer.Deserialize<SpotifyArtist>(json, _jsonSerializerOptions);
                if (artist == null) return null;

                return new ArtistDTO
                {
                    Id = artist.Id,
                    Name = artist.Name,
                    ImageUrl = artist.Images.Last().Url,
                    LinkUrl = artist.Uri
                };
            }
            else
            {
                return null;
            }
        }

        public async Task<List<MusicDTO>?> GetLastLikedSongs(User user, int limit = 5)
        {
            var client = await ConfigHttpClient(user);
            if (client == null) return null;

            var response = await client.GetAsync($"me/tracks?limit={limit}");
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();

                var pagedData = JsonSerializer.Deserialize<SpotifyPage<SpotifyLike>>(json, _jsonSerializerOptions);
                if (pagedData == null) return [];

                return TracksToMusics(pagedData.Items.Select(i => i.Track).ToList());
            }
            else
            {
                return null;
            }

        }

        public async Task<List<MusicDTO>?> GetQuerySongs(User user, string query, int offset = 0)
        {
            var client = await ConfigHttpClient(user);
            if (client == null) return null;

            var response = await client.GetAsync($"search?q={query}&type=track&offset={offset}");
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                var jsonObject = JsonDocument.Parse(json);
                var tracks = jsonObject.RootElement.GetProperty("tracks");

                var pagedData = JsonSerializer.Deserialize<SpotifyPage<SpotifyTrack>>(tracks, _jsonSerializerOptions);
                if (pagedData == null) return [];

                return TracksToMusics(pagedData.Items);
            }
            else
            {
                return null;
            }
        }

        public async Task<int?> GetLikedSongsCount(User user)
        {
            var client = await ConfigHttpClient(user);
            if (client == null) return null;

            var response = await client.GetAsync("me/tracks?limit=1");
            if (!response.IsSuccessStatusCode) return null;

            var json = await response.Content.ReadAsStringAsync();
            var pagedData = JsonSerializer.Deserialize<SpotifyPage<SpotifyLike>>(json, _jsonSerializerOptions);

            return pagedData?.Total;
        }

        #region Top items

        public async Task<List<MusicDTO>?> GetTopSongs(User user, int limit = 5)
        {
            var client = await ConfigHttpClient(user);
            if (client == null) return null;

            var response = await client.GetAsync($"me/top/tracks?limit={limit}");
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();

                var pagedData = JsonSerializer.Deserialize<SpotifyPage<SpotifyTrack>>(json, _jsonSerializerOptions);
                if (pagedData == null) return [];

                return TracksToMusics(pagedData.Items);
            }
            else
            {
                return null;
            }
        }

        public async Task<List<SpotifyArtist>?> GetTopArtists(User user, int limit = 5)
        {
            var client = await ConfigHttpClient(user);
            if (client == null) return null;

            var response = await client.GetAsync($"me/top/artists?limit={limit}");
            if (!response.IsSuccessStatusCode) return null;

            var json = await response.Content.ReadAsStringAsync();
            var pagedData = JsonSerializer.Deserialize<SpotifyPage<SpotifyArtist>>(json, _jsonSerializerOptions);
            if (pagedData == null) return [];

            return pagedData.Items;
        }

        #endregion

        private static List<MusicDTO> TracksToMusics(List<SpotifyTrack> tracks)
        {
            var musics = new List<MusicDTO>();
            foreach (var track in tracks)
            {
                musics.Add(new MusicDTO
                {
                    Id = track.Id,
                    Name = track.Name,
                    Artist = track.Artists.First().Name,
                    LinkUrl = track.Uri,
                    ImageUrl = track.Album.Images.Last().Url,
                });
            }

            return musics;
        }
    }
}