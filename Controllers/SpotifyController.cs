using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

using Harmony.Services.Interfaces;
using Harmony.Models;

namespace Harmony.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SpotifyController(UserManager<User> userManager, ISpotifyService spotifyService, IReccoService reccoService) : ControllerBase
    {

        private async Task<User?> GetUser()
        {
            var username = User.FindFirstValue(ClaimTypes.Name);
            if (username == null) return null;

            return await userManager.FindByNameAsync(username);
        }

        [Authorize]
        [HttpGet("lastLiked")]
        public async Task<IActionResult> GetLastLikedSongs([FromQuery] int limit = 5)
        {
            var user = await GetUser();
            if (user == null) return Unauthorized(new { Message = "Usuário não encontrado" });

            var musics = await spotifyService.GetLastLikedSongs(user, limit);
            if (musics == null) return BadRequest(new { Message = "Náo foi possível obter as últimas músicas curtidas" });

            return Ok(musics);
        }

        [Authorize]
        [HttpGet("top/songs")]
        public async Task<IActionResult> GetTopSongs([FromQuery] int limit = 5)
        {
            var user = await GetUser();
            if (user == null) return Unauthorized(new { Message = "Usuário não encontrado" });

            var musics = await spotifyService.GetTopSongs(user, limit);
            if (musics == null) return BadRequest(new { Message = "Não foi possível obter as músicas mais populares" });

            return Ok(musics);
        }

        [Authorize]
        [HttpGet("search")]
        public async Task<IActionResult> SearchSongs([FromQuery] string query, int offset = 0)
        {
            var user = await GetUser();
            if (user == null) return Unauthorized(new { Message = "Usuário não encontrado" });

            var musics = await spotifyService.GetQuerySongs(user, query, offset);
            if (musics == null) return BadRequest(new { Message = "Não foi possível obter as músicas de pesquisa" });

            return Ok(musics);
        }

        [Authorize]
        [HttpGet("recommendations")]
        public async Task<IActionResult> GetRecommendations([FromQuery] string[] seeds, int limit = 5)
        {
            var user = await GetUser();
            if (user == null) return Unauthorized(new { Message = "Usuário não encontrado" });

            var musics = await reccoService.GetRecommendations(user, seeds, limit);
            if (musics == null) return BadRequest(new { Message = "Não foi possível obter as músicas de recomendação" });

            return Ok(musics);
        }
    }
}