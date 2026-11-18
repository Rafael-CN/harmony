using System.Security.Claims;
using Harmony.Controllers.DTOs.Discovery;
using Harmony.Data;
using Harmony.Models;
using Harmony.Services.Spotify;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Harmony.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DiscoveryController(

        UserManager<User> userManager,
        ISpotifyService spotifyService,
        MongoDBContext mongoDBContext

    ) : ControllerBase
    {
        private readonly UserManager<User> _userManager = userManager;
        private readonly ISpotifyService _spotifyService = spotifyService;

        private readonly IMongoCollection<UserCompatibility> _compatibilityCollection = mongoDBContext.UserCompatibilities;
        private readonly IMongoCollection<User> _userCollection = mongoDBContext.Users;

        [HttpGet("users")]
        public async Task<IActionResult> GetRecommendedUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var currentUsername = User.FindFirstValue(ClaimTypes.Name);
            var currentUser = await _userManager.FindByNameAsync(currentUsername!);
            if (currentUser == null) return Unauthorized();

            var compatibilityDocs = await _compatibilityCollection
                .Find(c => c.UserId1 == currentUser.Id.ToString() || c.UserId2 == currentUser.Id.ToString())
                .SortByDescending(c => c.Score)
                .Skip((page - 1) * pageSize)
                .Limit(pageSize)
                .ToListAsync();

            if (!compatibilityDocs.Any()) return Ok(new List<RecommendedUserDTO>());

            var recommendedUsersIds = compatibilityDocs
                .Select(c => c.UserId1 == currentUser.Id.ToString() ? c.UserId2 : c.UserId1)
                .Select(id => ObjectId.Parse(id))
                .ToList();

            var filter = Builders<User>.Filter.In(u => u.Id, recommendedUsersIds);
            var recommendedUsers = await _userCollection.Find(filter).ToListAsync();

            var usersDict = recommendedUsers.ToDictionary(u => u.Id.ToString());

            var result = compatibilityDocs.Select(doc =>
            {
                var otherUserId = doc.UserId1 == currentUser.Id.ToString() ? doc.UserId2 : doc.UserId1;

                var recommendedUser = usersDict.GetValueOrDefault(otherUserId);
                if (recommendedUser == null) return null;

                return new RecommendedUserDTO
                {
                    Username = recommendedUser.UserName!,
                    DisplayName = recommendedUser.Profile?.DisplayName! ?? recommendedUser.UserName!,
                    ProfilePictureUrl = recommendedUser.Profile?.ProfilePictureUrl,
                    CompatibilityScore = doc.Score,
                    NowMusicId = recommendedUser.Profile?.NowMusicId
                };
            }).Where(u => u != null).ToList();

            return Ok(result);
        }

        [HttpGet("music")]
        public async Task<IActionResult> GetRecommendedMusic([FromQuery] int limit = 5)
        {
            var currentUsername = User.FindFirstValue(ClaimTypes.Name);
            var currentUser = await _userManager.FindByNameAsync(currentUsername!);
            if (currentUser == null) return Unauthorized();

            var recommendedSongs = await _spotifyService.GetRecommendations(currentUser, limit);
            return Ok(recommendedSongs);
        }

        [HttpGet("music/seeds")]
        public async Task<IActionResult> GetRecommendedMusic([FromQuery] List<string> s)
        {
            var currentUsername = User.FindFirstValue(ClaimTypes.Name);
            var currentUser = await _userManager.FindByNameAsync(currentUsername!);
            if (currentUser == null) return Unauthorized();

            var recommendedSongs = await _spotifyService.GetRecommendationsFromSeeds(currentUser, s);
            return Ok(recommendedSongs);
        }
    }
}