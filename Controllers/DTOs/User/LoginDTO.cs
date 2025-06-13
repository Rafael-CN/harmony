using System.ComponentModel.DataAnnotations;

namespace Harmony.Controllers.DTOs
{
    public class LoginDTO
    {
        [Required(ErrorMessage = "Nome de usuário é obrigatório")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Senha é obrigatória")]
        public string Password { get; set; } = string.Empty;
    }
}