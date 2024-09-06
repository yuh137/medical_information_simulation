namespace Medical_Information.API.Models.DTO
{
    public class AddStudentRequestDTO
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string? Firstname { get; set; }
        public string? Lastname { get; set; }
        public string Initials { get; set; }
    }
}
