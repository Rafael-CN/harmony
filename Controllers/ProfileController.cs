using Harmony.Controllers.DTOs.Profile;
using Harmony.Models;
using Harmony.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Harmony.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfileController(

        UserManager<User> userManager,
        IStatusService statusService

    ) : ControllerBase
    {
        private async Task<User?> GetUser()
        {
            var username = User.FindFirstValue(ClaimTypes.Name);
            if (username == null) return null;

            return await userManager.FindByNameAsync(username);
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            var user = await GetUser();
            if (user == null) return Unauthorized(new { Message = "Usuário não encontrado" });

            var status = await statusService.GetStatus(user);

            var publicProfile = new PublicProfileDTO
            {
                DisplayName = user.Profile?.DisplayName ?? user.UserName!,
                Bio = user.Profile?.Bio,
                ProfilePictureUrl = user.Profile?.ProfilePictureUrl,
                Status = status
            };

            return Ok(publicProfile);
        }

        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            var user = await userManager.FindByNameAsync(username);
            if (user == null) return NotFound(new { Message = "Perfil não encontrado" });

            var status = await statusService.GetStatus(user);

            var profileDto = new PublicProfileDTO
            {
                DisplayName = user.Profile?.DisplayName ?? user.UserName!,
                Bio = user.Profile?.Bio,
                ProfilePictureUrl = user.Profile?.ProfilePictureUrl,
                Status = status
            };

            return Ok(profileDto);
        }

        [HttpPut("me")]
        public async Task<IActionResult> UpdateMyProfile([FromBody] ProfileUpdateDTO model)
        {
            var user = await GetUser();
            if (user == null) return Unauthorized(new { Message = "Usuário não encontrado" });

            user.Profile ??= new Profile();
            user.Profile.DisplayName = model.DisplayName ?? user.Profile.DisplayName;
            user.Profile.Bio = model.Bio ?? user.Profile.Bio;
            user.Profile.ProfilePictureUrl = model.ProfilePictureUrl ?? user.Profile.ProfilePictureUrl;

            var result = await userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return Ok(new { Message = "Perfil atualizado com sucesso" });
            }

            return BadRequest(new { Message = "Não foi possível atualizar o perfil" });
        }
    }
}
