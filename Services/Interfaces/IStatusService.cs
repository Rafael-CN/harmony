using Harmony.Models;

namespace Harmony.Services.Interfaces
{
    public interface IStatusService
    {
        Task<Status?> GetStatus(User user);
    }
}