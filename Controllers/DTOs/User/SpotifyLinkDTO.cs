using System.ComponentModel.DataAnnotations;

namespace Harmony.Controllers.DTOs.User
{
    public class SpotifyLinkDTO
    {
        [Required(ErrorMessage = "Código de autorização é obrigatório")]
        public string AuthCode { get; set; } = string.Empty;
    }
}