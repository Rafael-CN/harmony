using Harmony.Models;
using MongoDB.Driver;

namespace Harmony.Data
{
    public class MongoDBContext
    {
        private readonly IMongoDatabase _database;

        public IMongoCollection<User> Users { get; }
        public IMongoCollection<Follow> Follows { get; }

        public MongoDBContext(IConfiguration configuration)
        {
            var client = new MongoClient(configuration.GetConnectionString("MongoConnection"));

            var databaseName = configuration["MongoDatabaseName"];
            if (string.IsNullOrEmpty(databaseName))
            {
                throw new ArgumentException(nameof(databaseName), "O nome do banco de dados não foi definido no arquivo de configuração.");
            }

            _database = client.GetDatabase(databaseName);

            Users = _database.GetCollection<User>("Users");
            Follows = _database.GetCollection<Follow>("Follows");
        }
    }
}