using AspNetCore.Identity.Mongo.Model;

namespace Harmony.Models
{
    public class User : MongoUser
    {
        public User() : base() { }
        public User(string userName) : base(userName) { }

        public Credential? Credential { get; set; }
        public Profile? Profile { get; set; }

        public Status? Status { get; set; }

        public int FollowersCount { get; set; } = 0;
        public int FollowingCount { get; set; } = 0;
    }
}