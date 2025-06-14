namespace Harmony.Services.DTOs.Spotify
{
    public class Artist
    {
        public required string Id { get; set; }

        public required string Name { get; set; }

        public required string Uri { get; set; }

        public required List<string> Genres { get; set; }
    }
}