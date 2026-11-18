namespace Harmony.Services.Follows
{
    public interface IFollowService
    {
        Task<bool> IsFollowingAsync(string followerId, string followingId);
        Task<bool> FollowAsync(string followerId, string followingId);
        Task<bool> UnfollowAsync(string followerId, string followingId);
    }
}