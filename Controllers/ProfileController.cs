using Harmony.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Harmony.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController(UserManager<User> userManager) : ControllerBase
    {
        private async Task<User?> GetUser()
        {
            var username = User.FindFirstValue(ClaimTypes.Name);
            if (username == null) return null;

            return await userManager.FindByNameAsync(username);
        }

        [Authorize]
        [HttpGet("name")]
        public async Task<IActionResult> GetDisplayName()
        {
            var user = await GetUser();
            if (user == null) return Unauthorized(new { Message = "Usuário não encontrado" });

            return Ok(new { user.Profile?.DisplayName });
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var user = await GetUser();
            if (user == null) return Unauthorized(new { Message = "Usuário não encontrado" });

            return Ok(new { user.Profile });
        }

    }
}
