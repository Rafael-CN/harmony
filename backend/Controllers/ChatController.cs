using System.Security.Claims;
using Harmony.Controllers.DTOs.Chat;
using Harmony.Hubs;
using Harmony.Models;
using Harmony.Services.Chats;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver.Core.Servers;

namespace Harmony.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IChatService _chatService;
        private readonly IHubContext<ChatHub> _hubContext;

        public ChatController(UserManager<User> userManager, IChatService chatService, IHubContext<ChatHub> hubContext)
        {
            _userManager = userManager;
            _chatService = chatService;
            _hubContext = hubContext;
        }

        private async Task<User?> GetUser()
        {
            var username = User.FindFirstValue(ClaimTypes.Name);
            if (username == null) return null;

            return await _userManager.FindByNameAsync(username);
        }

        [HttpGet]
        public async Task<IActionResult> GetMyChats()
        {
            var user = await GetUser();
            if (user == null) return Unauthorized();

            var chats = await _chatService.GetChatsForUserAsync(user.Id.ToString());
            var chatListDtos = new List<ChatListItemDTO>();

            foreach (var chat in chats)
            {
                var otherParticipantId = chat.ParticipantsIds.FirstOrDefault(id => id != user.Id.ToString());
                if (otherParticipantId == null) continue;

                var otherParticipant = await _userManager.FindByIdAsync(otherParticipantId);
                if (otherParticipant == null) continue;

                var lastMessage = await _chatService.GetLastMessageForChatAsync(chat.Id);

                chatListDtos.Add(new ChatListItemDTO
                {
                    ChatId = chat.Id,
                    OtherParticipant = new OtherParticipant
                    {
                        Username = otherParticipant.UserName,
                        DisplayName = otherParticipant.Profile?.DisplayName,
                        ProfilePictureUrl = otherParticipant.Profile?.ProfilePictureUrl,
                    },
                    LastMessage = lastMessage?.Content,
                    LastMessageAt = chat.LastMessageAt,
                });
            }

            return Ok(chatListDtos);
        }

        [HttpGet("{username}")]
        public async Task<IActionResult> GetChatByUserId(string username)
        {
            var user = await GetUser();
            if (user == null) return Unauthorized();

            var otherUser = await _userManager.FindByNameAsync(username);
            if (otherUser == null) return BadRequest();

            var chat = await _chatService.GetOrCreateChatAsync(user.Id.ToString(), otherUser.Id.ToString());
            if (chat == null) return BadRequest(new { Message = "Não foi possível criar o chat" });

            return Ok(chat);
        }

        [HttpGet("{chatId}/messages")]
        public async Task<IActionResult> GetChatMessages(string chatId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var user = await GetUser();
            if (user == null) return Unauthorized();

            var chat = await _chatService.GetChatByIdAsync(chatId);
            if (chat == null || !chat.ParticipantsIds.Contains(user.Id.ToString())) return Forbid();

            var messages = await _chatService.GetMessagesForChatAsync(chatId, page, pageSize);
            var messagesDtos = new List<MessageItemDTO>();

            foreach (var message in messages)
            {
                messagesDtos.Add(new MessageItemDTO
                {
                    ChatId = chatId,
                    Id = message.Id,
                    Content = message.Content,
                    CreatedAt = message.CreatedAt,
                    SenderId = message.SenderId
                });
            }

            return Ok(messagesDtos);
        }

        [HttpPost("{chatId}/messages")]
        public async Task<IActionResult> SendChatMessage(string chatId, [FromBody] SendMessageDTO model)
        {
            var user = await GetUser();
            if (user == null) return Unauthorized();

            var chat = await _chatService.GetChatByIdAsync(chatId);
            if (chat == null || !chat.ParticipantsIds.Contains(user.Id.ToString())) return Forbid();

            var message = await _chatService.SendMessageAsync(chatId, user.Id.ToString(), model.Content);
            if (message == null) return BadRequest(new { Message = "Não foi possível enviar a mensagem" });

            var messageDto = new MessageItemDTO
            {
                ChatId = chatId,
                Id = message.Id,
                Content = message.Content,
                CreatedAt = message.CreatedAt,
                SenderId = message.SenderId
            };

            await _hubContext.Clients.Group(chatId).SendAsync("ReceiveMessage", messageDto);

            return Ok(messageDto);
        }

    }
}