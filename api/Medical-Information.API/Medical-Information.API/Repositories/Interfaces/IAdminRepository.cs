using Medical_Information.API.Models.Domain;
using Medical_Information.API.Models.DTO;

namespace Medical_Information.API.Repositories.Interfaces
{
    public interface IAdminRepository
    {
        Task<List<Admin>> GetAdminAsync(string? filterQuery = null);
        Task<Admin?> GetAdminByIdAsync(Guid id);
        Task<Admin> CreateAdminAsync(Admin admin);
        Task<Admin?> UpdateAdminPasswordAsync(Guid id, UpdatePasswordDTO updatePassword);
        Task<Admin?> DeleteAdminAsync(Guid id);
    }
}
