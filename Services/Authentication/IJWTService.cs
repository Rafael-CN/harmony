using Harmony.Models;

namespace Harmony.Services.Authentication
{
    public interface IJWTService
    {
        string GenerateJwtToken(User user);
    }
}