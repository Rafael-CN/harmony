using Harmony.Model;
using Harmony.Models;
using MongoDB.Driver;

namespace Harmony.Data
{
    public class MongoDBContext
    {
        private readonly IMongoDatabase _database;

        public IMongoCollection<User> Users => _database.GetCollection<User>("Users");
        public IMongoCollection<Follow> Follows => _database.GetCollection<Follow>("Follows");
        public IMongoCollection<UserCompatibility> UserCompatibilities => _database.GetCollection<UserCompatibility>("UserCompatibilities");

        public IMongoCollection<Chat> Chats => _database.GetCollection<Chat>("Chats");
        public IMongoCollection<Message> Messages => _database.GetCollection<Message>("Messages");

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

            var chatIndexKeysDefinition = Builders<Chat>.IndexKeys.Ascending(c => c.ParticipantsIds);
            Chats.Indexes.CreateOneAsync(new CreateIndexModel<Chat>(chatIndexKeysDefinition));

            var messageIndexKeysDefinition = Builders<Message>.IndexKeys.Ascending(m => m.ChatId);
            Messages.Indexes.CreateOneAsync(new CreateIndexModel<Message>(messageIndexKeysDefinition));
        }
    }
}