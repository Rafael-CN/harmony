namespace Harmony.Controllers.DTOs.Discovery
{
    public class RecommendedUserDTO
    {
        public string Username { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string? ProfilePictureUrl { get; set; }
        public int CompatibilityScore { get; set; }
    }
}