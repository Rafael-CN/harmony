using Harmony.Models;
using Harmony.Services.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace Harmony.Services
{
    public class StatusService
    (
        ILogger<StatusService> _logger,
        UserManager<User> _userManager,
        ISpotifyService _spotifyService

    ) : IStatusService
    {
        private async Task<bool> UpdateStatus(User user)
        {
            var status = user.Status ?? new Status();
            status.LastUpdate = DateTime.UtcNow;

            var topArtists = await _spotifyService.GetTopArtists(user);
            var topSongs = await _spotifyService.GetTopSongs(user);

            status.TopArtists = topArtists?.Select(a => a.Name).ToList();
            status.TopSongs = topSongs?.Select(s => s.Name).ToList();

            if (topArtists != null && topArtists.Any())
            {
                status.TopGenres = topArtists
                                    .SelectMany(a => a.Genres)
                                    .GroupBy(g => g)
                                    .OrderByDescending(g => g.Count())
                                    .Select(g => g.Key)
                                    .Take(5).ToList();
            }

            status.LikedCount = await _spotifyService.GetLikedSongsCount(user);

            user.Status = status;
            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                _logger.LogError("--> Erro ao atualizar status: {Error}", result.Errors.First().Description);
            }

            return result.Succeeded;
        }

        public async Task<Status?> GetStatus(User user)
        {
            if (user.Status == null || DateTime.UtcNow.AddDays(-1) > user.Status.LastUpdate)
            {
                _logger.LogInformation("Atualizando status para o usuário {UserId}", user.Id);
                if (!await UpdateStatus(user))
                {
                    return null;
                }
            }

            return user.Status;
        }
    }
}
