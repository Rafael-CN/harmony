using Harmony.Data;
using Harmony.Model;
using Harmony.Models;
using Harmony.Services.Follows;
using MongoDB.Driver;

namespace Harmony.Services.Chats
{
    public class ChatService : IChatService
    {
        private readonly IFollowService _followService;
        private readonly IMongoCollection<Chat> _chatsCollection;
        private readonly IMongoCollection<Message> _messagesCollection;

        public ChatService(IFollowService followService, MongoDBContext mongoDBContext)
        {
            _followService = followService;
            _chatsCollection = mongoDBContext.Chats;
            _messagesCollection = mongoDBContext.Messages;
        }

        private async Task<bool> IsMatchAsync(string userId1, string userId2)
        {
            var task1 = _followService.IsFollowingAsync(userId1, userId2);
            var task2 = _followService.IsFollowingAsync(userId2, userId1);

            await Task.WhenAll(task1, task2);

            return task1.Result && task2.Result;
        }

        public async Task<Chat?> GetOrCreateChatAsync(string userId1, string userId2)
        {
            if (userId1 == userId2) return null;

            var filter = Builders<Chat>.Filter.All(c => c.ParticipantsIds, [userId1, userId2]);
            var existingChat = await _chatsCollection.Find(filter).FirstOrDefaultAsync();

            if (existingChat != null) return existingChat;

            if (!await IsMatchAsync(userId1, userId2)) return null;

            var newChat = new Chat
            {
                ParticipantsIds = [userId1, userId2],
            };

            await _chatsCollection.InsertOneAsync(newChat);
            return newChat;
        }

        public async Task<Chat?> GetChatByIdAsync(string chatId)
        {
            return await _chatsCollection.Find(c => c.Id == chatId).FirstOrDefaultAsync();
        }

        public async Task<Message?> SendMessageAsync(string chatId, string senderId, string content)
        {
            var chat = await _chatsCollection.Find(c => c.Id == chatId).FirstOrDefaultAsync();
            if (chat == null || !chat.ParticipantsIds.Contains(senderId)) return null;

            var message = new Message
            {
                ChatId = chatId,
                SenderId = senderId,
                Content = content,
            };

            await _messagesCollection.InsertOneAsync(message);

            var update = Builders<Chat>.Update
                            .Set(c => c.LastMessageId, message.Id)
                            .Set(c => c.LastMessageAt, message.CreatedAt);

            await _chatsCollection.UpdateOneAsync(c => c.Id == chatId, update);

            return message;
        }

        public async Task<List<Chat>> GetChatsForUserAsync(string userId)
        {
            return await _chatsCollection
                            .Find(c => c.ParticipantsIds.Contains(userId))
                            .SortByDescending(c => c.LastMessageAt)
                            .ToListAsync();
        }

        public async Task<List<Message>> GetMessagesForChatAsync(string chatId, int page = 1, int pageSize = 20)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 20;

            var messages = await _messagesCollection
                                .Find(m => m.ChatId == chatId)
                                .SortByDescending(m => m.CreatedAt)
                                .Skip((page - 1) * pageSize)
                                .Limit(pageSize)
                                .ToListAsync();

            return messages;
        }

        public async Task<Message?> GetLastMessageForChatAsync(string chatId)
        {
            return await _messagesCollection
                        .Find(m => m.ChatId == chatId)
                        .SortByDescending(m => m.CreatedAt)
                        .FirstOrDefaultAsync();
        }

    }
}