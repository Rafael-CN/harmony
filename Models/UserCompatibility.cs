using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Harmony.Models
{
    public class UserCompatibility
    {
        [BsonId]
        public ObjectId Id { get; set; }

        public string UserId1 { get; set; } = null!;
        public string UserId2 { get; set; } = null!;

        public int Score { get; set; }

        public DateTime LastCalculated { get; set; }
    }
}