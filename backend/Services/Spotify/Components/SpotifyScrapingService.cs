using HtmlAgilityPack;

namespace Harmony.Services.Spotify.Components
{
    public class SpotifyScrapingService(

        IHttpClientFactory httpClientFactory,
        ILogger<SpotifyScrapingService> logger

    ) : ISpotifyScrapingService
    {
        public async Task<List<string>> GetScrapedRecommendations(string url)
        {
            var client = httpClientFactory.CreateClient("SpotifyPublicPage");
            if (url == null) return [];

            var html = await client.GetStringAsync(url);
            var htmlDoc = new HtmlDocument();
            htmlDoc.LoadHtml(html);

            var recommendedSongs = htmlDoc.DocumentNode
                .Descendants()
                .Where(node => node.Name == "a")
                .Select(node => node.GetAttributeValue("href", ""))
                .Where(href => href.Contains("track"))
                .Select(href => href.Split("/").Last())
                .Distinct()
                .ToList();

            return recommendedSongs;
        }


        public async Task<string?> GetScrapedPreviewUrl(string url)
        {
            try
            {
                var client = httpClientFactory.CreateClient("SpotifyPublicPage");

                var html = await client.GetStringAsync(url);
                var htmlDoc = new HtmlDocument();
                htmlDoc.LoadHtml(html);

                var scdnLink = htmlDoc.DocumentNode
                    .Descendants()
                    .SelectMany(node => node.Attributes)
                    .Select(attr => attr.Value)
                    .FirstOrDefault(value => !string.IsNullOrEmpty(value) && value.Contains("p.scdn.co"));

                if (scdnLink != null)
                {
                    return scdnLink;
                }
                else
                {
                    logger.LogWarning("--> Não foi possível obter a URL do preview da música: {TrackUrl}", url);
                    return null;
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "--> Erro ao obter a URL do preview da música: {TrackUrl}", url);
                return null;
            }
        }
    }
}