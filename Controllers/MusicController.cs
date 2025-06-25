using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

using Harmony.Models;
using Harmony.Services.Spotify;

namespace Harmony.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MusicController(

        UserManager<User> userManager,
        ISpotifyService spotifyService

    ) : ControllerBase
    {

        private async Task<User?> GetUser()
        {
            var username = User.FindFirstValue(ClaimTypes.Name);
            if (username == null) return null;

            return await userManager.FindByNameAsync(username);
        }

        [HttpGet("liked")]
        public async Task<IActionResult> GetLastLikedSongs([FromQuery] int limit = 5)
        {
            var user = await GetUser();
            if (user == null) return Unauthorized(new { Message = "Usuário não encontrado" });

            var musics = await spotifyService.GetLastLikedSongs(user, limit);
            if (musics == null) return BadRequest(new { Message = "Náo foi possível obter as últimas músicas curtidas" });

            return Ok(musics);
        }

        [HttpPost("liked")]
        public async Task<IActionResult> SetLikedSongs([FromBody] List<string> trackIds)
        {
            var user = await GetUser();
            if (user == null) return Unauthorized(new { Message = "Usuário não encontrado" });

            var success = await spotifyService.SetLikedSongs(user, trackIds);
            if (!success) return BadRequest(new { Message = "Não foi possível curtir as músicas" });

            return Ok(new { Message = "Músicas curtidas com sucesso" });
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchSongs([FromQuery] string query, int offset = 0)
        {
            var user = await GetUser();
            if (user == null) return Unauthorized(new { Message = "Usuário não encontrado" });

            var musics = await spotifyService.GetQuerySongs(user, query, offset);
            if (musics == null) return BadRequest(new { Message = "Não foi possível obter as músicas de pesquisa" });

            return Ok(musics);
        }

        [HttpGet("artists")]
        public async Task<IActionResult> GetArtists([FromQuery] List<string> ids)
        {
            var user = await GetUser();
            if (user == null) return Unauthorized(new { Message = "Usuário não encontrado" });

            var artists = await spotifyService.GetArtists(user, ids);
            if (artists == null) return BadRequest(new { Message = "Não foi possível obter os artistas" });

            return Ok(artists);
        }

        [HttpGet("{trackId}")]
        public async Task<IActionResult> GetTrack(string trackId)
        {
            var user = await GetUser();
            if (user == null) return Unauthorized(new { Message = "Usuário não encontrado" });

            var music = await spotifyService.GetSong(user, trackId);
            if (music == null) return BadRequest(new { Message = "Não foi possível encontrar a música" });

            return Ok(music);
        }

        [HttpGet("{trackId}/preview")]
        public async Task<IActionResult> GetTrackPreview(string trackId)
        {
            var user = await GetUser();
            if (user == null) return Unauthorized(new { Message = "Usuário não encontrado" });

            var previewUrl = await spotifyService.GetTrackPreviewUrl(trackId);
            if (previewUrl == null) return BadRequest(new { Message = "Não foi possível obter a URL do preview do track" });

            return Ok(new { url = previewUrl });
        }
    }
}