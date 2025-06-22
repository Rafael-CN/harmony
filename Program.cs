using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using AspNetCore.Identity.Mongo.Model;
using AspNetCore.Identity.Mongo;
using System.Text;

using Harmony.Models;
using Harmony.Data;
using Harmony.Middlewares;
using Harmony.Services.Authentication;
using Harmony.Services.Spotify;
using Harmony.Services.Recommendations;
using Harmony.Services.UserStatus;
using Harmony.Services.Photos;
using Harmony.Services.Follows;
using Hangfire;
using Hangfire.Mongo;
using Hangfire.Mongo.Migration.Strategies;
using Hangfire.Mongo.Migration.Strategies.Backup;
using Harmony.Services.Spotify.Components;

var builder = WebApplication.CreateBuilder(args);

var mongoConnectionString = builder.Configuration.GetConnectionString("MongoConnection");
var hangfireConnectionString = builder.Configuration.GetConnectionString("HangfireConnection");

builder.Services.AddIdentityMongoDbProvider<User, MongoRole>(
    identityOptions =>
    {
        identityOptions.Password.RequiredLength = 6;
        identityOptions.Password.RequireDigit = false;
        identityOptions.Password.RequireUppercase = false;
        identityOptions.Password.RequireLowercase = false;
        identityOptions.Password.RequireNonAlphanumeric = false;
    },
    mongoIdentityOptions =>
    {
        mongoIdentityOptions.ConnectionString = mongoConnectionString;
    }
);

builder.Services.AddSingleton<MongoDBContext>();
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Secret"]!))
    };
});

builder.Services.AddHangfire(configuration => configuration
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UseMongoStorage(hangfireConnectionString, new MongoStorageOptions
    {
        Prefix = "hangfire.mongo",
        CheckQueuedJobsStrategy = CheckQueuedJobsStrategy.TailNotificationsCollection,
        MigrationOptions = new MongoMigrationOptions
        {
            MigrationStrategy = new MigrateMongoMigrationStrategy(),
            BackupStrategy = new CollectionMongoBackupStrategy()
        },
    })
);

builder.Services.AddHangfireServer();

builder.Services.AddOpenApi();
builder.Services.AddControllers();

builder.Services.AddHttpClient("SpotifyAuth", client =>
{
    client.BaseAddress = new Uri("https://accounts.spotify.com/api/");
});

builder.Services.AddHttpClient("SpotifyApi", client =>
{
    client.BaseAddress = new Uri("https://api.spotify.com/v1/");
});

builder.Services.AddScoped<IJWTService, JWTService>();
builder.Services.AddScoped<IStatusService, StatusService>();
builder.Services.AddScoped<IPhotoService, PhotoService>();
builder.Services.AddScoped<IFollowService, FollowService>();
builder.Services.AddScoped<ICompatibilityService, CompatibilityService>();

builder.Services.AddScoped<ISpotifyAuthService, SpotifyAuthService>();
builder.Services.AddScoped<ISpotifyApiService, SpotifyApiService>();
builder.Services.AddScoped<ISpotifyScrapingService, SpotifyScrapingService>();

builder.Services.AddScoped<ISpotifyService, SpotifyService>();

builder.Services.AddMemoryCache();

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHangfireDashboard();

app.UseRouting();
app.UseMiddleware<ResponseMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

RecurringJob.AddOrUpdate<ICompatibilityService>(
    "Calculate-user-compatibilities",
    service => service.CalculateAllUserCompatibilities(),
    Cron.Daily()
);

app.Run();
