using Harmony.Models;

namespace Harmony.Controllers.DTOs.Profile
{
    public class PublicProfileDTO
    {
        public string DisplayName { get; set; } = string.Empty;
        public string? Bio { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public Status? Status { get; set; }

        public int FollowersCount { get; set; }
        public int FollowingCount { get; set; }
    }
}