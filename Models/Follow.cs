using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Harmony.Models
{
    public class Follow
    {
        public Follow() { }

        public Follow(string followerId, string followingId)
        {
            FollowerId = followerId;
            FollowingId = followingId;
            CreatedAt = DateTime.UtcNow;
        }

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        [BsonRepresentation(BsonType.ObjectId)]
        public string FollowerId { get; set; } = null!;

        [BsonRepresentation(BsonType.ObjectId)]
        public string FollowingId { get; set; } = null!;

        public DateTime CreatedAt { get; set; }
    }
}