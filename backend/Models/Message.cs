using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Harmony.Models
{
    public class Message
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        [BsonRepresentation(BsonType.ObjectId)]
        public string ChatId { get; set; } = null!;

        [BsonRepresentation(BsonType.ObjectId)]
        public string SenderId { get; set; } = null!;

        public string Content { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}