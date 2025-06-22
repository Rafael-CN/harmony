using Harmony.Contracts.Music;
using Harmony.Models;
using Harmony.Services.Spotify.DTOs;

namespace Harmony.Services.Spotify.Components
{
    public interface ISpotifyApiService
    {
        public Task<MusicDTO?> GetSong(User user, string id);
        public Task<List<MusicDTO>?> GetSongs(User user, IEnumerable<string> ids);

        public Task<ArtistDTO?> GetArtist(User user, string id);
        public Task<List<ArtistDTO>?> GetArtists(User user, IEnumerable<string> ids);

        public Task<List<MusicDTO>?> GetLastLikedSongs(User user, int limit = 5);
        public Task<int?> GetLikedSongsCount(User user);
        public Task<bool> SetLikedSongs(User user, List<string> trackIds);

        public Task<List<bool>> CheckLikedSongs(User user, List<string> trackIds);

        public Task<List<MusicDTO>?> GetQuerySongs(User user, string query, int offset = 0);

        public Task<List<MusicDTO>?> GetTopSongs(User user, int limit = 5);
        public Task<List<SpotifyArtist>?> GetTopArtists(User user, int limit = 5);

    }
}