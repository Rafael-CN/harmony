using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

using Harmony.Controllers.DTOs.User;
using Harmony.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Harmony.Services.Authentication;
using Harmony.Services.Spotify;

namespace Harmony.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController(

        UserManager<User> userManager,
        IJWTService jwtService,
        ISpotifyService spotifyService

    ) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var alreadyExists = await userManager.FindByNameAsync(model.Username);
            if (alreadyExists != null)
            {
                return BadRequest(new { Message = "O nome de usuário já está sendo usado" });
            }

            var user = new User(model.Username)
            {
                Profile = new(model.Username)
            };

            var result = await userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                return Ok(new { Message = "Usuário criado com sucesso" });
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return BadRequest(ModelState);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await userManager.FindByNameAsync(model.Username);
            if (user != null && await userManager.CheckPasswordAsync(user, model.Password))
            {
                var token = jwtService.GenerateJwtToken(user);
                return Ok(new LoginResponseDTO
                {
                    Token = token,
                    Username = user.UserName!,
                });
            }

            return Unauthorized(new { Message = "Usuário ou senha inválidos" });
        }

        [Authorize]
        [HttpGet("name")]
        public IActionResult GetUsername()
        {
            var username = User.FindFirstValue(ClaimTypes.Name);
            if (username == null) return Unauthorized(new { Message = "Usuário não encontrado" });

            return Ok(new { Username = username });
        }

        [Authorize]
        [HttpPost("spotify/link")]
        public async Task<IActionResult> LinkSpotifyAccount([FromBody] SpotifyLinkDTO model)
        {
            var username = User.FindFirstValue(ClaimTypes.Name);
            var user = await userManager.FindByNameAsync(username!);

            if (user == null) return Unauthorized(new { Message = "Usuário não encontrado" });
            if (user.Credential != null) return Ok(new { Message = "Conta Spotify já vinculada" });

            var token = await spotifyService.GetToken(model.AuthCode);
            if (token == null) return Unauthorized(new { Message = "Token de autorização inválido" });

            user.Credential = new Credential
            {
                AccessToken = token.AccessToken,
                RefreshToken = token.RefreshToken,
                ExpirationDate = DateTime.UtcNow.AddSeconds(token.ExpiresIn)
            };

            var result = await userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                return Ok(new { Message = "Conta Spotify vinculada com sucesso" });
            }
            else
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
                return BadRequest(ModelState);
            }
        }

        [Authorize]
        [HttpPost("spotify/isLinked")]
        public async Task<IActionResult> IsSpotifyLinked()
        {
            var username = User.FindFirstValue(ClaimTypes.Name);
            var user = await userManager.FindByNameAsync(username!);
            if (user == null) return Unauthorized(new { Message = "Usuário não encontrado" });

            return Ok(new { IsLinked = user.Credential != null });
        }
    }
}