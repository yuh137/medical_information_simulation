using ScrumDumpsterMolecularDiagnostic.Models.Domain;
using ScrumDumpsterMolecularDiagnostic.Models.DTO;

namespace ScrumDumpsterMolecularDiagnostic.Repositories.Interfaces
{
    public interface IAdminRepository
    {
        Task<List<Admin>> GetAdminAsync(string? filterQuery = null);
        Task<Admin?> GetAdminByIdAsync(Guid id);
        Task<Admin?> GetAdminByNameAsync(string name);
        Task<Admin> CreateAdminAsync(Admin admin);
        Task<Admin?> DeleteAdminAsync(Guid id);
    }
}
