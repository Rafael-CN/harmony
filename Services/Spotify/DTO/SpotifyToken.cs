namespace Harmony.Services.Spotify.DTOs
{
    public class SpotifyToken
    {
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public int ExpiresIn { get; set; }
    }
}