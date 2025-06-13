namespace Harmony.Services.DTOs.Spotify
{
    public class Album
    {
        public required string Id { get; set; }

        public int TotalTracks { get; set; }

        public required string Name { get; set; }
        public required string Uri { get; set; }

        public required List<Image> Images { get; set; }
    }
}