using Harmony.Models;
using Harmony.Services.Spotify;
using Microsoft.AspNetCore.Identity;

namespace Harmony.Services.UserStatus
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

            var topArtists = await _spotifyService.GetTopArtists(user, 10);
            var topSongs = await _spotifyService.GetTopSongs(user, 10);

            status.TopArtists = topArtists?.Select(a => a.Id).ToList();
            status.TopSongs = topSongs?.Select(s => s.Id).ToList();

            if (topArtists != null && topArtists.Any())
            {
                status.TopGenres = topArtists
                                    .SelectMany(a => a.Genres)
                                    .GroupBy(g => g)
                                    .OrderByDescending(g => g.Count())
                                    .Select(g => g.Key)
                                    .Take(10).ToList();
            }

            status.LikedCount = await _spotifyService.GetLikedSongsCount(user);

            var userSave = await _userManager.FindByIdAsync(user.Id.ToString()); 
            if (userSave == null)
            {
                _logger.LogError("--> Não foi possível encontrar o usuário para atualizar seu status");
                return false;
            }

            userSave.Status = status;
            var result = await _userManager.UpdateAsync(userSave);

            if (!result.Succeeded)
            {
                _logger.LogError("--> Erro ao atualizar status: {Error}", result.Errors.First().Description);
            }

            return result.Succeeded;
        }

        public async Task<Status?> GetStatus(User user)
        {
            if (user.Credential == null) return null;

            if (user.Status == null || DateTime.UtcNow.AddDays(-1) > user.Status.LastUpdate)
            {
                _logger.LogInformation("Atualizando status para o usuário {UserId}", user.Id);
                if (await UpdateStatus(user))
                {
                    var updatedUser = await _userManager.FindByIdAsync(user.Id.ToString());
                    return updatedUser?.Status;
                } else
                {
                    return user.Status;
                }
            }

            return user.Status;
        }
    }
}
