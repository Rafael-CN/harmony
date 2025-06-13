using System.ComponentModel.DataAnnotations;

namespace Harmony.Controllers.DTOs
{
    public class RegisterDTO
    {
        [Required(ErrorMessage = "Nome de usuário é obrigatório")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Senha é obrigatória")]
        [MinLength(8, ErrorMessage = "A senha deve ter pelo menos 8 caracteres")]
        public string Password { get; set; } = string.Empty;
    }
}