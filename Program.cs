using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using AspNetCore.Identity.Mongo.Model;
using AspNetCore.Identity.Mongo;
using System.Text;

using Harmony.Services.Interfaces;
using Harmony.Services;
using Harmony.Models;
using Harmony.Data;
using Harmony.Middlewares;

var builder = WebApplication.CreateBuilder(args);
var mongoConnectionString = builder.Configuration.GetConnectionString("MongoConnection");

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
builder.Services.AddScoped<ISpotifyService, SpotifyService>();
builder.Services.AddScoped<IReccoService, ReccoService>();

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseRouting();
app.UseMiddleware<ResponseMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
