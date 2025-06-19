using Harmony.Contracts.Music;
using Harmony.Models;
using Harmony.Services.Spotify.DTOs;

namespace Harmony.Services.Spotify
{
    public interface ISpotifyService
    {
        Task<string?> GetAccessToken(User user);
        Task<SpotifyToken?> GetToken(string authCode);

        Task<List<MusicDTO>?> GetLastLikedSongs(User user, int limit = 5);
        Task<List<MusicDTO>?> GetQuerySongs(User user, string query, int offset = 0);

        Task<MusicDTO?> GetSong(User user, string id);
        Task<List<MusicDTO>?> GetSongs(User user, IEnumerable<string> ids);

        Task<ArtistDTO?> GetArtist(User user, string id);

        Task<List<MusicDTO>?> GetTopSongs(User user, int limit = 5);
        Task<List<SpotifyArtist>?> GetTopArtists(User user, int limit = 5);

        Task<List<string>?> GetRecommendations(User user);
        Task<List<string>?> GetRecommendations(User user, List<string> trackIds);

        Task<string?> GetTrackPreviewUrl(string trackId);

        Task<int?> GetLikedSongsCount(User user);
    }
}