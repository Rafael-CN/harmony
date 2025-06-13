using MongoDB.Driver;

namespace Harmony.Data
{
    public class MongoDBContext
    {
        private readonly IMongoDatabase _database;

        public MongoDBContext(IConfiguration configuration)
        {
            var client = new MongoClient(configuration.GetConnectionString("MongoConnection"));
            _database = client.GetDatabase(configuration["MongoDatabaseName"]);
        }
    }
}