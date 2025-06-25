using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Harmony.Model
{
    public class Chat
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        public List<string> ParticipantsIds { get; set; } = [];

        [BsonRepresentation(BsonType.ObjectId)]
        public string? LastMessageId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastMessageAt { get; set; } = DateTime.UtcNow;
    }
}