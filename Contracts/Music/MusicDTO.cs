namespace Harmony.Contracts.Music
{
    public class MusicDTO
    {
        public required string Id { get; set; }

        public required string Name { get; set; }
        public required string Artist { get; set; }

        public required string LinkUrl { get; set; }
        public required string ImageUrl { get; set; }
    }
}