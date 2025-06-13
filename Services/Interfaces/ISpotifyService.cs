using Harmony.Models;
using Harmony.Services.DTOs.Spotify;
using Harmony.Services.Models;

namespace Harmony.Services.Interfaces
{
    public interface ISpotifyService
    {
        Task<string?> GetAccessToken(User user);
        Task<Token?> GetToken(string authCode);

        Task<List<Music>?> GetLastLikedSongs(User user, int limit = 5);
        Task<List<Music>?> GetQuerySongs(User user, string query, int offset = 0);
        Task<List<Music>?> GetTopSongs(User user, int limit = 5);
        Task<Music?> GetSong(User user, string id);
        Task<List<Music>?> GetSongs(User user, IEnumerable<string> ids);
    }
}