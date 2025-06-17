using Harmony.Models;

namespace Harmony.Services.UserStatus
{
    public interface IStatusService
    {
        Task<Status?> GetStatus(User user);
    }
}