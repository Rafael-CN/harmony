namespace Harmony.Services.DTOs.Spotify
{
    public class Track
    {
        public required string Id { get; set; }

        public required string Name { get; set; }

        public required string Type { get; set; }
        public bool Explicit { get; set; }

        public int Popularity { get; set; }
        public int DurationMs { get; set; }

        public required string Uri { get; set; }

        public string? PreviewUrl { get; set; }

        public required Album Album { get; set; }
        public required List<Artist> Artists { get; set; }
    }
}