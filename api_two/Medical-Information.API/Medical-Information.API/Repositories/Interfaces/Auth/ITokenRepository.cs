using Microsoft.AspNetCore.Identity;

namespace Medical_Information.API.Repositories.Interfaces.Auth
{
    public interface ITokenRepository
    {
        public string CreateJWTToken(IdentityUser user, List<string> roles);
        public bool IsTokenValid(string token);
    }
}
