namespace Harmony.Services.DTOs.Recco
{
    public class Track
    {
        public required string Id { get; set; }

        public required string TrackTitle { get; set; }
        public required string Href { get; set; }

        public required int Popularity { get; set; }

        public required List<Artist> Artists { get; set; }
    }
}