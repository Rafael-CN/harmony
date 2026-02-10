namespace Harmony.Services.Spotify.DTOs
{
    public class SpotifyAlbum
    {
        public required string Id { get; set; }

        public int TotalTracks { get; set; }

        public required string Name { get; set; }
        public required string Uri { get; set; }

        public string ReleaseDate { get; set; } = string.Empty;

        public required List<SpotifyImage> Images { get; set; }
    }
}