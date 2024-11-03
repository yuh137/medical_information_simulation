using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medical_Information.API.Models.Domain
{
    public class Student
    {
        [Key]
        public Guid StudentID { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Initials { get; set; }
        public ICollection<StudentReport> Reports { get; set; } = [];
        public ICollection<Admin> Admins { get; set; } = [];
    }
}
