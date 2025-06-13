using Harmony.Models;
using Harmony.Services.Models;

namespace Harmony.Services.Interfaces
{
    public interface IReccoService
    {
        Task<List<Music>?> GetRecommendations(User user, IEnumerable<string> seeds, int limit = 5);
    }
}