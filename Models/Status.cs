namespace Harmony.Models
{
    public class Status
    {
        public DateTime? LastUpdate { get; set; }

        public List<string>? TopArtists { get; set; }

        public List<string>? TopSongs { get; set; }

        public List<string>? TopGenres { get; set; }

        public int? LikedCount { get; set; }
    }
}
