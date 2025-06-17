namespace Harmony.Services.Spotify.DTOs
{
    public class SpotifyPage<T>
    {
        public required List<T> Items { get; set; }
        public required int Total { get; set; }
    }
}
