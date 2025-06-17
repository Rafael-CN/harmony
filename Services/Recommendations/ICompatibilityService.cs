namespace Harmony.Services.Recommendations
{
    public interface ICompatibilityService
    {
        Task CalculateAllUserCompatibilities();
    }
}