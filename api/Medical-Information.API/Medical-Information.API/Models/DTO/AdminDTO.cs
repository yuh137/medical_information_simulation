using Medical_Information.API.Models.Domain;

namespace Medical_Information.API.Models.DTO
{
    public class AdminDTO
    {
        public string Username { get; set; }
        public string? Firstname { get; set; }
        public string? Lastname { get; set; }
        public string Email { get; set; }
        public string Initials { get; set; }
        public ICollection<Student> Students { get; set; } = [];
        public ICollection<AdminAnalyteReport> Reports { get; set; } = [];
    }
}
