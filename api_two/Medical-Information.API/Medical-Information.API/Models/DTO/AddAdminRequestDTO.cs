
using Medical_Information.API.Enums;
using Medical_Information.API.Models.Domain;
using System.ComponentModel.DataAnnotations;

namespace Medical_Information.API.Models.DTO
{
   public class AddAdminRequestDTO
   {
      [Required]
      // public Guid AdminID { get; set; }
      public string Username { get; set; }
      public string Email { get; set; }
      public string? Firstname { get; set; }
      public string? Lastname { get; set; }
      public string Initials { get; set; }

      [Required]
      [MinLength(8)]
      public string Password { get; set; }

      public ICollection<Student> Students { get; set; } = [];
   }
}
