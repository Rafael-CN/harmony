using Harmony.Contracts.Music;
using Harmony.Models;
using Harmony.Services.Spotify.Components;

namespace Harmony.Services.Spotify
{
    public interface ISpotifyService : ISpotifyApiService, ISpotifyAuthService
    {
        Task<List<MusicDTO>?> GetRecommendations(User user, int limit = 5);
        Task<List<MusicDTO>?> GetRecommendationsFromSeeds(User user, List<string> trackIds, int limit = 5);

        Task<string?> GetTrackPreviewUrl(string trackId);
    }
}