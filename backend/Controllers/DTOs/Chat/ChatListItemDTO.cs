namespace Harmony.Controllers.DTOs.Chat
{
    public class ChatListItemDTO
    {
        public string ChatId { get; set; } = null!;

        public OtherParticipant OtherParticipant { get; set; } = null!;

        public string? LastMessage { get; set; } = string.Empty;
        public DateTime LastMessageAt { get; set; }
    }

    public class OtherParticipant
    {
        public string? Username { get; set; } = string.Empty;
        public string? DisplayName { get; set; } = string.Empty;
        public string? ProfilePictureUrl { get; set; } = string.Empty;
    }
}