using Harmony.Controllers.DTOs.Profile;
using Harmony.Models;
using Harmony.Services.Follows;
using Harmony.Services.Photos;
using Harmony.Services.UserStatus;
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
        IStatusService statusService,
        IPhotoService photoService,
        IFollowService followService

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
                Status = status,
                FollowersCount = user.FollowersCount,
                FollowingCount = user.FollowingCount
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
                Status = status,
                FollowersCount = user.FollowersCount,
                FollowingCount = user.FollowingCount
            };

            return Ok(profileDto);
        }

        [HttpPost("{username}/follow")]
        public async Task<IActionResult> FollowProfile(string username)
        {
            var user = await GetUser();
            if (user == null) return Unauthorized(new { Message = "Usuário não encontrado" });

            var targetUser = await userManager.FindByNameAsync(username);
            if (targetUser == null) return NotFound(new { Message = "Perfil não encontrado" });

            if (user.Id == targetUser.Id) return BadRequest(new { Message = "Você não pode seguir a si mesmo" });

            var result = await followService.FollowAsync(user.Id.ToString(), targetUser.Id.ToString());
            if (!result) return BadRequest(new { Message = "Erro ao seguir o perfil" });

            return Ok(new { Message = "Perfil seguido com sucesso" });
        }

        [HttpPost("{username}/unfollow")]
        public async Task<IActionResult> UnfollowProfile(string username)
        {
            var user = await GetUser();
            if (user == null) return Unauthorized(new { Message = "Usuário não encontrado" });

            var targetUser = await userManager.FindByNameAsync(username);
            if (targetUser == null) return NotFound(new { Message = "Perfil não encontrado" });

            var result = await followService.UnfollowAsync(user.Id.ToString(), targetUser.Id.ToString());
            if (!result) return BadRequest(new { Message = "Erro ao deixar de seguir o perfil" });

            return Ok(new { Message = "Perfil deixado de seguir com sucesso" });
        }

        [HttpPut("me")]
        public async Task<IActionResult> UpdateMyProfile([FromBody] ProfileUpdateDTO model)
        {
            var user = await GetUser();
            if (user == null) return Unauthorized(new { Message = "Usuário não encontrado" });

            user.Profile ??= new Profile();
            user.Profile.DisplayName = model.DisplayName ?? user.Profile.DisplayName;
            user.Profile.Bio = model.Bio ?? user.Profile.Bio;

            var result = await userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return Ok(new { Message = "Perfil atualizado com sucesso" });
            }

            return BadRequest(new { Message = "Não foi possível atualizar o perfil" });
        }


        [HttpPost("me/photo")]
        public async Task<IActionResult> AddProfilePhoto([FromForm] IFormFile file)
        {
            var user = await GetUser();
            if (user == null) return Unauthorized(new { Message = "Usuário não encontrado" });

            if (file == null || file.Length <= 0) return BadRequest(new { Message = "Nenhum arquivo enviado." });

            var uploadResult = await photoService.AddPhotoAsync(file);
            if (uploadResult.Error != null) return BadRequest(new { Message = "Houve um erro ao salvar a foto" });

            user.Profile ??= new Profile(user.UserName!);
            user.Profile.ProfilePictureUrl = uploadResult.SecureUrl.ToString();

            var result = await userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return Ok(new { url = user.Profile.ProfilePictureUrl });
            }

            return BadRequest(new { Message = "Não foi possível salvar a foto de perfil." });
        }
    }
}
