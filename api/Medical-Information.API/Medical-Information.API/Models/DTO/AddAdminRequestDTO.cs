using System.ComponentModel.DataAnnotations;

namespace Medical_Information.API.Models.DTO
{
    public class AddAdminRequestDTO
    {
        [Required]
        [StringLength(20, ErrorMessage = "Username cannot exceed 20 characters")]
        [MinLength(8, ErrorMessage = "Minimum 8 characters")]
        public string Username { get; set; }
        [Required]
        [MinLength(8, ErrorMessage = "Minimum 8 characters")]
        public string Password { get; set; }
    }
}
