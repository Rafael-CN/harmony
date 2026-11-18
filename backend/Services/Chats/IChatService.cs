using Harmony.Model;
using Harmony.Models;

namespace Harmony.Services.Chats
{
    public interface IChatService
    {
        Task<Chat?> GetOrCreateChatAsync(string userId1, string userId2);

        Task<Chat?> GetChatByIdAsync(string chatId);

        Task<Message?> SendMessageAsync(string chatId, string senderId, string content);

        Task<List<Chat>> GetChatsForUserAsync(string userId);

        Task<List<Message>> GetMessagesForChatAsync(string chatId, int page, int pageSize);

        Task<Message?> GetLastMessageForChatAsync(string chatId);
    }
}