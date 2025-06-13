using Harmony.Models;

namespace Harmony.Services.Interfaces
{
    public interface IJWTService
    {
        string GenerateJwtToken(User user);
    }
}