namespace Harmony.Contracts.Music
{
    public class MusicDTO
    {
        public required string Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Artist { get; set; } = string.Empty;

        public string ReleaseYear { get; set; } = string.Empty;

        public string LinkUrl { get; set; } = string.Empty;

        public string SmallImageUrl { get; set; } = string.Empty;
        public string MediumImageUrl { get; set; } = string.Empty;
        public string LargeImageUrl { get; set; } = string.Empty;
    }
}