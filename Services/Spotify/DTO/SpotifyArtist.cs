namespace Harmony.Services.Spotify.DTOs
{
    public class SpotifyArtist
    {
        public required string Id { get; set; }

        public required string Name { get; set; }

        public required string Uri { get; set; }

        public List<string> Genres { get; set; } = [];

        public List<SpotifyImage> Images { get; set; } = [];

    }
}