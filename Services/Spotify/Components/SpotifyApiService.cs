using System.Text.Json;
using Harmony.Contracts.Music;
using Harmony.Models;
using Harmony.Services.Spotify.DTOs;

namespace Harmony.Services.Spotify.Components
{
    public class SpotifyApiService
    (

        ISpotifyAuthService spotifyAuthService,
        ILogger<SpotifyApiService> logger

    ) : ISpotifyApiService
    {
        private readonly JsonSerializerOptions _jsonSerializerOptions = new()
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
        };

        public async Task<MusicDTO?> GetSong(User user, string id)
        {
            var client = await spotifyAuthService.ConfigHttpClient(user);
            if (client == null) return null;

            var response = await client.GetAsync($"tracks/{id}");
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();

                var track = JsonSerializer.Deserialize<SpotifyTrack>(json, _jsonSerializerOptions);
                if (track == null) return null;

                ; return TrackToMusic(track);
            }
            else
            {
                return null;
            }
        }

        public async Task<List<MusicDTO>?> GetSongs(User user, IEnumerable<string> ids)
        {
            if (ids == null || !ids.Any()) return null;

            var client = await spotifyAuthService.ConfigHttpClient(user);
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
            var client = await spotifyAuthService.ConfigHttpClient(user);
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

        public async Task<List<ArtistDTO>?> GetArtists(User user, IEnumerable<string> ids)
        {
            if (ids == null || !ids.Any()) return null;

            var client = await spotifyAuthService.ConfigHttpClient(user);
            if (client == null) return null;

            var artistsId = string.Join(",", ids.Take(50));

            var response = await client.GetAsync($"artists?ids={artistsId}");
            if (!response.IsSuccessStatusCode) return null;

            var json = await response.Content.ReadAsStringAsync();
            var jsonObject = JsonDocument.Parse(json);
            var artistsData = jsonObject.RootElement.GetProperty("artists");

            var artists = JsonSerializer.Deserialize<List<SpotifyArtist>>(artistsData, _jsonSerializerOptions);
            if (artists == null) return [];

            return artists.Select(artist => new ArtistDTO
            {
                Id = artist.Id,
                Name = artist.Name,
                ImageUrl = artist.Images.Last().Url,
                LinkUrl = artist.Uri
            }).ToList();
        }

        public async Task<List<MusicDTO>?> GetLastLikedSongs(User user, int limit = 5)
        {
            var client = await spotifyAuthService.ConfigHttpClient(user);
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
                logger.LogWarning("--> Não foi possível obter as últimas músicas curtidas: {Error}", await response.Content.ReadAsStringAsync());
                return null;
            }

        }

        public async Task<List<MusicDTO>?> GetQuerySongs(User user, string query, int offset = 0)
        {
            var client = await spotifyAuthService.ConfigHttpClient(user);
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
            var client = await spotifyAuthService.ConfigHttpClient(user);
            if (client == null) return null;

            var response = await client.GetAsync("me/tracks?limit=1");
            if (!response.IsSuccessStatusCode) return null;

            var json = await response.Content.ReadAsStringAsync();
            var pagedData = JsonSerializer.Deserialize<SpotifyPage<SpotifyLike>>(json, _jsonSerializerOptions);

            return pagedData?.Total;
        }

        public async Task<List<bool>> CheckLikedSongs(User user, List<string> trackIds)
        {
            var client = await spotifyAuthService.ConfigHttpClient(user);
            if (client == null) return [];

            var response = await client.GetAsync($"me/tracks/contains?ids={string.Join(",", trackIds)}");
            if (!response.IsSuccessStatusCode) return [];

            var json = await response.Content.ReadAsStringAsync();
            var data = JsonSerializer.Deserialize<List<bool>>(json, _jsonSerializerOptions);

            return data ?? [];
        }

        public async Task<List<MusicDTO>?> GetTopSongs(User user, int limit = 5)
        {
            var client = await spotifyAuthService.ConfigHttpClient(user);
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
            var client = await spotifyAuthService.ConfigHttpClient(user);
            if (client == null) return null;

            var response = await client.GetAsync($"me/top/artists?limit={limit}");
            if (!response.IsSuccessStatusCode) return null;

            var json = await response.Content.ReadAsStringAsync();
            var pagedData = JsonSerializer.Deserialize<SpotifyPage<SpotifyArtist>>(json, _jsonSerializerOptions);
            if (pagedData == null) return [];

            return pagedData.Items;
        }

        private List<MusicDTO> TracksToMusics(List<SpotifyTrack> tracks)
        {
            var musics = new List<MusicDTO>();
            foreach (var track in tracks)
            {
                musics.Add(TrackToMusic(track));
            }

            return musics;
        }

        private MusicDTO TrackToMusic(SpotifyTrack track)
        {
            return new MusicDTO
            {
                Id = track.Id,
                Name = track.Name,
                Artist = track.Artists.First().Name,
                LinkUrl = track.Uri,
                SmallImageUrl = track.Album.Images.Last().Url,
                LargeImageUrl = track.Album.Images.First().Url,
                MediumImageUrl = track.Album.Images[1].Url,
            };
        }

    }
}