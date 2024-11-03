using Microsoft.AspNetCore.Identity;

namespace ScrumDumpsterMolecularDiagnostic.Repositories.Interfaces.Auth
{
    public interface ITokenRepository
    {
        public string CreateJWTToken(IdentityUser user, List<string> roles);
        public bool IsTokenValid(string token);
    }
}
