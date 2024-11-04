using Medical_Information.API.Enums;
using Medical_Information.API.Models.Domain;
using System.ComponentModel.DataAnnotations;

namespace Medical_Information.API.Models.DTO
{
   public class AddStudentRequestDTO
   {
      [Required]
      public Guid StudentID { get; set; }
      public string Username { get; set; }
      public string Email { get; set; }
      public string Firstname { get; set; }
      public string Lastname { get; set; }
      public string Initials { get; set; }
      public string Password { get; set; }

      public ICollection<StudentReport> Reports { get; set; } = [];
      public ICollection<Admin> Admins { get; set; } = [];
   }
}
