using System.Net.Http.Headers;
using System.Text.Json;
using Harmony.Models;
using Harmony.Services.Spotify.DTOs;
using Microsoft.AspNetCore.Identity;

namespace Harmony.Services.Spotify.Components
{
    public class SpotifyAuthService(

        IConfiguration configuration,
        IHttpClientFactory httpClientFactory,
        UserManager<User> userManager,
        ILogger<SpotifyAuthService> logger

    ) : ISpotifyAuthService
    {
        private readonly JsonSerializerOptions _jsonSerializerOptions = new()
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
        };

        private string GetBasicHeader()
        {
            var basicHeader = configuration["SpotifySettings:ClientId"] + ":" + configuration["SpotifySettings:ClientSecret"];
            basicHeader = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(basicHeader));
            return basicHeader;
        }

        public async Task<HttpClient?> ConfigHttpClient(User user)
        {
            var accessToken = await GetAccessToken(user);
            if (accessToken == null) return null;

            var client = httpClientFactory.CreateClient("SpotifyApi");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            return client;
        }

        public async Task<string?> GetAccessToken(User user)
        {
            if (user.Credential == null) return null;
            if (user.Credential.ExpirationDate > DateTime.UtcNow.AddMinutes(5)) return user.Credential.AccessToken;

            var client = httpClientFactory.CreateClient("SpotifyAuth");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", GetBasicHeader());

            var response = await client.PostAsync("token", new FormUrlEncodedContent(new Dictionary<string, string>
            {
                { "grant_type", "refresh_token" },
                { "refresh_token", user.Credential.RefreshToken! },
            }));

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();

                var token = JsonSerializer.Deserialize<SpotifyToken>(json, _jsonSerializerOptions);
                if (token == null) return null;

                if (token.RefreshToken != null)
                {
                    // user.Credential.RefreshToken = token.RefreshToken;
                }

                user.Credential.AccessToken = token.AccessToken;
                user.Credential.ExpirationDate = DateTime.UtcNow.AddSeconds(token.ExpiresIn);

                await userManager.UpdateAsync(user);
                return token.AccessToken;
            }
            else
            {
                logger.LogInformation("--> Erro ao pedir token de acesso: {Error}", await response.Content.ReadAsStringAsync());
                return null;
            }
        }

        public async Task<SpotifyToken?> GetToken(string authCode)
        {
            var client = httpClientFactory.CreateClient("SpotifyAuth");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", GetBasicHeader());

            var response = await client.PostAsync("token", new FormUrlEncodedContent(new Dictionary<string, string>
            {
                { "code", authCode },
                { "redirect_uri", configuration["SpotifySettings:RedirectUri"]! },
                { "grant_type", "authorization_code" },
            }));

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();

                var token = JsonSerializer.Deserialize<SpotifyToken>(json, _jsonSerializerOptions);
                return token;
            }
            else
            {
                logger.LogInformation("--> Erro ao obter tokens de Spotify: {Error}", await response.Content.ReadAsStringAsync());
                return null;
            }
        }

    }
}