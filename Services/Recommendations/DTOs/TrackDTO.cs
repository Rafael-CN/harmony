namespace Harmony.Services.Recommendations.DTOs
{
    public class TrackDTO
    {
        public required string Id { get; set; }

        public required string TrackTitle { get; set; }
        public required string Href { get; set; }

        public required int Popularity { get; set; }

        public required List<ArtistDTO> Artists { get; set; }
    }
}