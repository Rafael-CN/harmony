using Hangfire.Storage.Monitoring;
using Harmony.Data;
using Harmony.Models;
using Microsoft.AspNetCore.Identity;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Harmony.Services.Recommendations
{
    public class CompatibilityService : ICompatibilityService
    {
        private readonly UserManager<User> _userManager;
        private readonly IMongoCollection<UserCompatibility> _userCompatibilities;
        private readonly ILogger<CompatibilityService> _logger;

        public CompatibilityService(
            UserManager<User> userManager,
            MongoDBContext mongoDBContext,
            ILogger<CompatibilityService> logger
        )
        {
            _userManager = userManager;
            _userCompatibilities = mongoDBContext.UserCompatibilities;
            _logger = logger;
        }

        public async Task CalculateAllUserCompatibilities()
        {
            _logger.LogInformation("Iniciando cálculo de compatibilidade de todos os usuários...");

            var usersWithStatus = await _userManager.Users
                .Where(u => u.Status != null && u.Status.LastUpdate.HasValue)
                .ToListAsync();

            if (usersWithStatus.Count < 2)
            {
                _logger.LogInformation("Não há usuários suficientes para calcular compatibilidade.");
                return;
            }

            var artistsToUsers = new Dictionary<string, List<string>>();
            var genresToUsers = new Dictionary<string, List<string>>();
            var songsToUsers = new Dictionary<string, List<string>>();

            foreach (var user in usersWithStatus)
            {
                PopulateIndex(artistsToUsers, user.Status!.TopArtists!, user.Id.ToString());
                PopulateIndex(genresToUsers, user.Status!.TopGenres!, user.Id.ToString());
                PopulateIndex(songsToUsers, user.Status!.TopSongs!, user.Id.ToString());
            }

            var compatibilityScores = new Dictionary<(string, string), int>();

            ProcessIndex(compatibilityScores, artistsToUsers, 10);
            ProcessIndex(compatibilityScores, genresToUsers, 5);
            ProcessIndex(compatibilityScores, songsToUsers, 1);

            if (!compatibilityScores.Any())
            {
                _logger.LogInformation("Nenhuma compatibilidade encontrada para atualizar.");
                return;
            }

            await _userCompatibilities.DeleteManyAsync(new BsonDocument());

            var updates = new List<WriteModel<UserCompatibility>>();
            foreach (var (pair, score) in compatibilityScores)
            {
                var compatibilityDoc = new UserCompatibility
                {
                    UserId1 = pair.Item1,
                    UserId2 = pair.Item2,
                    Score = score,
                    LastCalculated = DateTime.UtcNow
                };

                updates.Add(new InsertOneModel<UserCompatibility>(compatibilityDoc));
            }

            await _userCompatibilities.BulkWriteAsync(updates);

            _logger.LogInformation("Cálculo de compatibilidade finalizado com sucesso. {Count} pares atualizados", updates.Count);
        }

        private void PopulateIndex(Dictionary<string, List<string>> index, IEnumerable<string> tastes, string userId)
        {
            if (tastes == null) return;
            foreach (var taste in tastes)
            {
                if (!index.ContainsKey(taste))
                {
                    index[taste] = new List<string>();
                }

                index[taste].Add(userId);
            }
        }

        private void ProcessIndex(Dictionary<(string, string), int> scores, Dictionary<string, List<string>> index, int points)
        {
            foreach (var userList in index.Values)
            {
                if (userList.Count < 2) continue;

                for (int i = 0; i < userList.Count; i++)
                {
                    for (int j = i + 1; j < userList.Count; j++)
                    {
                        var user1 = userList[i];
                        var user2 = userList[j];

                        var key = string.Compare(user1, user2) < 0 ? (user1, user2) : (user2, user1);

                        if (!scores.ContainsKey(key))
                        {
                            scores[key] = 0;
                        }

                        scores[key] += points;
                    }
                }
            }
        }
    }
}