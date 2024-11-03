using Medical_Information.API.Validators;
using System.ComponentModel.DataAnnotations;

namespace Medical_Information.API.Models.DTO.Auth
{
    public class RegisterRequestDTO
    {
        [Required]
        public string Username { get; set; }
        [Required]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }
        [Required]
        [DataType(DataType.Password)]
        [MinLength(8, ErrorMessage = "Password has to be at least 8 characters")]
        [PasswordComplexity]
        public string Password { get; set; }
        [Required]
        public string Firstname { get; set; }
        [Required]
        public string Lastname { get; set; }
        [Required]
        public string Initials { get; set; }
        [Required]
        public string[] Roles { get; set; }
    }
}
