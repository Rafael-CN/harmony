using Harmony.Models;

namespace Harmony.Controllers.DTOs.Profile
{
    public class PublicProfileDTO
    {
        public PublicProfileDTO() { }

        public PublicProfileDTO(Models.User user)
        {
            UserId = user.Id.ToString();
            DisplayName = user.Profile?.DisplayName ?? user.UserName!;
            Username = user.UserName!;
            Bio = user.Profile?.Bio;
            ProfilePictureUrl = user.Profile?.ProfilePictureUrl;

            FollowersCount = user.FollowersCount;
            FollowingCount = user.FollowingCount;

            NowMusicId = user.Profile?.NowMusicId;
        }

        public string UserId { get; set; } = null!;

        public string? DisplayName { get; set; }
        public string? Username { get; set; }

        public string? Bio { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public Status? Status { get; set; }

        public int FollowersCount { get; set; }
        public int FollowingCount { get; set; }

        public string? NowMusicId { get; set; }
    }
}