namespace Harmony.Services.Spotify.Components
{
    public interface ISpotifyScrapingService
    {
        public Task<List<string>> GetScrapedRecommendations(string url);
        public Task<string?> GetScrapedPreviewUrl(string url);
    }
}