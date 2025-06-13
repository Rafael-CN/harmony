namespace Harmony.Models
{
    public class Profile
    {
        public Profile() {}
        public Profile(string displayName) { 
            DisplayName = displayName;
        }

        public string? DisplayName { get; set; }
        public string? Bio { get; set; }

        public string? ProfilePictureUrl { get; set; }
        public string? NowMusicId { get; set; }
    }
}