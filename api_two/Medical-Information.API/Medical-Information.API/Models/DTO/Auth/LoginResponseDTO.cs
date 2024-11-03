namespace Medical_Information.API.Models.DTO.Auth
{
    public class LoginResponseDTO
    {
        public string JwtToken { get; set; }
        public Guid UserID { get; set; }
        public List<string> Roles { get; set; }
    }
}
