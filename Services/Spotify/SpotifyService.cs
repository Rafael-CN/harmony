using System.Text.Json;
using Harmony.Contracts.Music;
using Harmony.Models;
using Harmony.Services.Spotify.Components;
using Harmony.Services.Spotify.DTOs;
using Microsoft.Extensions.Caching.Memory;

namespace Harmony.Services.Spotify
{
    public class SpotifyService(

        ISpotifyAuthService authService,
        ISpotifyApiService apiService,
        ISpotifyScrapingService scrapingService,
        IMemoryCache memoryCache

    ) : ISpotifyService
    {
        #region Delegates

        public Task<HttpClient?> ConfigHttpClient(User user) => authService.ConfigHttpClient(user);

        public Task<string?> GetAccessToken(User user) => authService.GetAccessToken(user);
        public Task<SpotifyToken?> GetToken(string authCode) => authService.GetToken(authCode);

        public Task<MusicDTO?> GetSong(User user, string id) => apiService.GetSong(user, id);
        public Task<List<MusicDTO>?> GetSongs(User user, IEnumerable<string> ids) => apiService.GetSongs(user, ids);

        public Task<ArtistDTO?> GetArtist(User user, string id) => apiService.GetArtist(user, id);
        public Task<List<ArtistDTO>?> GetArtists(User user, IEnumerable<string> ids) => apiService.GetArtists(user, ids);

        public Task<List<MusicDTO>?> GetLastLikedSongs(User user, int limit = 5) => apiService.GetLastLikedSongs(user, limit);
        public Task<int?> GetLikedSongsCount(User user) => apiService.GetLikedSongsCount(user);
        public Task<bool> SetLikedSongs(User user, List<string> trackIds) => apiService.SetLikedSongs(user, trackIds);

        public Task<List<bool>> CheckLikedSongs(User user, List<string> trackIds) => apiService.CheckLikedSongs(user, trackIds);

        public Task<List<MusicDTO>?> GetQuerySongs(User user, string query, int offset = 0) => apiService.GetQuerySongs(user, query, offset);

        public Task<List<MusicDTO>?> GetTopSongs(User user, int limit = 5) => apiService.GetTopSongs(user, limit);
        public Task<List<SpotifyArtist>?> GetTopArtists(User user, int limit = 5) => apiService.GetTopArtists(user, limit);

        #endregion

        public async Task<List<MusicDTO>?> GetRecommendations(User user, int limit = 5)
        {
            var recommendedIds = await GetRecommendationsIds(user, limit);
            if (recommendedIds == null || !recommendedIds.Any()) return [];

            return await apiService.GetSongs(user, recommendedIds);
        }

        public async Task<List<MusicDTO>?> GetRecommendationsFromSeeds(User user, List<string> trackIds, int limit = 5)
        {
            var recommendedIds = await GetRecommendationsIdsFromSeeds(user, trackIds, limit);
            if (recommendedIds == null || !recommendedIds.Any()) return [];

            return await apiService.GetSongs(user, recommendedIds);
        }

        private async Task<List<string>?> GetRecommendationsIds(User user, int limit = 5)
        {
            var topSongsIds = user.Status?.TopSongs;
            if (topSongsIds == null || !topSongsIds.Any()) {
                var topSongs = await GetTopSongs(user, 10);
                if (topSongs == null || !topSongs.Any()) return null;

                topSongsIds = topSongs.Select(s => s.Id).ToList();
            };

            var cacheKey = $"recommendations:{user.Id}";
            if (memoryCache.TryGetValue(cacheKey, out List<string>? cachedRecommendations))
            {
                return await FilterUnlikedSongs(user, cachedRecommendations!, limit);
            }

            var recommendations = await GetRecommendationsIdsFromSeeds(user, topSongsIds, 50);

            var cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromHours(24));

            memoryCache.Set(cacheKey, recommendations, cacheOptions);

            return recommendations?.Take(limit).ToList();
        }

        private async Task<List<string>?> GetRecommendationsIdsFromSeeds(User user, List<string> trackIds, int limit = 5)
        {
            if (trackIds == null || !trackIds.Any()) return null;

            var tracksUrls = trackIds.Select(id => $"https://open.spotify.com/track/{id}")
                                    .OrderBy(t => Guid.NewGuid())
                                    .Take(5);

            var recommendedSongs = await Task.WhenAll(tracksUrls.Select(scrapingService.GetScrapedRecommendations));

            var recommendedUrls = recommendedSongs
                                    .SelectMany(i => i)
                                    .Distinct()
                                    .Select(id => $"https://open.spotify.com/track/{id}")
                                    .OrderBy(i => Guid.NewGuid())
                                    .Take(5);

            recommendedSongs = await Task.WhenAll(recommendedUrls.Select(scrapingService.GetScrapedRecommendations));

            return await FilterUnlikedSongs(user, recommendedSongs.SelectMany(i => i).ToList(), limit);
        }

        private async Task<List<string>?> FilterUnlikedSongs(User user, List<string> trackIds, int limit = 5)
        {
            if (trackIds == null || !trackIds.Any()) return null;

            var limitedSongs = trackIds.Distinct().Take(50).ToList();
            var checkedSongs = await apiService.CheckLikedSongs(user, limitedSongs);

            var unlikedSongs = limitedSongs.Where((_, index) => !checkedSongs[index]).ToList();
            return unlikedSongs.OrderBy(i => Guid.NewGuid()).Take(limit).ToList();
        }

        public async Task<string?> GetTrackPreviewUrl(string trackId)
        {
            var cacheKey = $"preview:{trackId}";

            if (memoryCache.TryGetValue(cacheKey, out string? cachedPreviewUrl))
            {
                return cachedPreviewUrl;
            }

            var trackUrl = $"https://open.spotify.com/track/{trackId}";
            var previewUrl = await scrapingService.GetScrapedPreviewUrl(trackUrl);

            var cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromHours(24));

            memoryCache.Set(cacheKey, previewUrl, cacheOptions);

            return previewUrl;
        }

    }
}