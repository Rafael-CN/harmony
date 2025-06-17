using Harmony.Models;
using MongoDB.Driver;

namespace Harmony.Data
{
    public class MongoDBContext
    {
        private readonly IMongoDatabase _database;

        public IMongoCollection<User> Users { get; }
        public IMongoCollection<Follow> Follows { get; }
        public IMongoCollection<UserCompatibility> UserCompatibilities { get; }

        public MongoDBContext(IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("MongoConnection");
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new ArgumentNullException(nameof(connectionString), "A string de conexão 'MongoConnection' não foi encontrada.");
            }

            var mongoUrl = new MongoUrl(connectionString);

            var databaseName = mongoUrl.DatabaseName;
            if (string.IsNullOrEmpty(databaseName))
            {
                throw new ArgumentException("A string de conexão deve conter o nome do banco de dados.");
            }

            var client = new MongoClient(mongoUrl);
            _database = client.GetDatabase(databaseName);

            Users = _database.GetCollection<User>("Users");
            Follows = _database.GetCollection<Follow>("Follows");
            UserCompatibilities = _database.GetCollection<UserCompatibility>("UserCompatibilities");
        }
    }
}