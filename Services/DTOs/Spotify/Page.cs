namespace Harmony.Services.DTOs.Spotify
{
    public class Page<T>
    {
        public required List<T> Items { get; set; }
    }
}
