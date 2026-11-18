namespace Harmony.Services.Spotify.DTOs
{
    public class SpotifyLike
    {
        public string? AddedAt { get; set; }

        public required SpotifyTrack Track { get; set; }
    }
}