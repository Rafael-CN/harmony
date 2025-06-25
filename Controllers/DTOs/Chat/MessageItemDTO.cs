namespace Harmony.Controllers.DTOs.Chat
{
    public class MessageItemDTO
    {
        public string ChatId { get; set; } = null!;

        public string Id { get; set; } = null!;

        public string? Content { get; set; }

        public string SenderId { get; set; } = null!;

        public DateTime CreatedAt { get; set; }
    }
}
