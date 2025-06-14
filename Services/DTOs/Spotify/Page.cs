namespace Harmony.Services.DTOs.Spotify
{
    public class Page<T>
    {
        public required List<T> Items { get; set; }
        public required int Total { get; set; }
    }
}
