using Harmony.Contracts.Music;
using Harmony.Models;

namespace Harmony.Services.Recommendations
{
    public interface IReccoService
    {
        Task<List<MusicDTO>?> GetRecommendations(User user, IEnumerable<string> seeds, int limit = 5);
    }
}