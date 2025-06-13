namespace Harmony.Services.DTOs.Spotify
{
    public class Like
    {
        public string? AddedAt { get; set; }

        public required Track Track { get; set; }
    }
}