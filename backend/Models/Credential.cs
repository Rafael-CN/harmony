namespace Harmony.Models
{
    public class Credential
    {
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? ExpirationDate { get; set; }
    }
}