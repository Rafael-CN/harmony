using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace Harmony.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DebugController(IMemoryCache memoryCache, IWebHostEnvironment env) : ControllerBase
    {
        [HttpDelete("cache/recommendations/{userId}")]
        public IActionResult ClearRecommendationsCache(string userId)
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            var cacheKey = $"recommendations:{userId}";
            memoryCache.Remove(cacheKey);

            return Ok(new { message = $"Cache key '{cacheKey}' removed." });
        }

        [HttpDelete("cache/preview/{trackId}")]
        public IActionResult ClearPreviewCache(string trackId)
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            var cacheKey = $"preview:{trackId}";
            memoryCache.Remove(cacheKey);

            return Ok(new { message = $"Cache key '{cacheKey}' removed." });
        }
    }
}