using Harmony.Models;
using Harmony.Services.Spotify.DTOs;

namespace Harmony.Services.Spotify.Components
{
    public interface ISpotifyAuthService
    {
        public Task<HttpClient?> ConfigHttpClient(User user);

        public Task<string?> GetAccessToken(User user);
        public Task<SpotifyToken?> GetToken(string authCode);
    }
}