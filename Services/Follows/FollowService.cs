using System.Runtime.CompilerServices;
using Harmony.Data;
using Harmony.Models;
using Microsoft.AspNetCore.Identity;
using MongoDB.Driver;

namespace Harmony.Services.Follows
{
    public class FollowService : IFollowService
    {
        private readonly IMongoCollection<Follow> _followsCollection;
        private readonly UserManager<User> _userManager;

        public FollowService(MongoDBContext mongoDBContext, UserManager<User> userManager)
        {
            _followsCollection = mongoDBContext.Follows;
            _userManager = userManager;
        }

        public async Task<bool> IsFollowingAsync(string followerId, string followingId)
        {
            if (followerId == followingId) return false;

            var follow = await _followsCollection.Find(f => f.FollowerId == followerId && f.FollowingId == followingId).FirstOrDefaultAsync();
            return follow != null;
        }

        public async Task<bool> FollowAsync(string followerId, string followingId)
        {
            if (followerId == followingId) return false;
            if (await IsFollowingAsync(followerId, followingId)) return true;

            var follow = new Follow(followerId, followingId);
            await _followsCollection.InsertOneAsync(follow);

            await UpdateUserFollowCounts(followerId, u => u.FollowingCount++);
            await UpdateUserFollowCounts(followingId, u => u.FollowersCount++);

            return true;
        }

        public async Task<bool> UnfollowAsync(string followerId, string followingId)
        {
            if (followerId == followingId) return false;

            var deleteResult = await _followsCollection.DeleteOneAsync(f => f.FollowerId == followerId && f.FollowingId == followingId);
            if (deleteResult.DeletedCount == 0) return true;

            await UpdateUserFollowCounts(followerId, u => u.FollowingCount--);
            await UpdateUserFollowCounts(followingId, u => u.FollowersCount--);

            return true;
        }

        private async Task<bool> UpdateUserFollowCounts(string userId, Action<User> updateAction)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            updateAction(user);

            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded;
        }
    }
}