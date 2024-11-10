using Medical_Information.API.Data;
using Medical_Information.API.Models.Domain;
using Medical_Information.API.Models.DTO;
using Medical_Information.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Medical_Information.API.Repositories.SQLImplementation
{
    public class SQLAdminRepository : IAdminRepository
    {
        private readonly MedicalInformationDbContext dbContext;
        public SQLAdminRepository(MedicalInformationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<Admin> CreateAdminAsync(Admin admin)
        {
            await dbContext.Admins.AddAsync(admin);
            await dbContext.SaveChangesAsync();
            return admin;
        }

        public async Task<Admin?> DeleteAdminAsync(Guid id)
        {
            var existingAdmin = await dbContext.Admins.FirstOrDefaultAsync(item => item.AdminID == id);

            if (existingAdmin == null)
            {
                return null;
            }

            dbContext.Admins.Remove(existingAdmin);
            await dbContext.SaveChangesAsync();

            return existingAdmin;
        }

        public async Task<List<Admin>> GetAdminAsync(string? filterQuery)
        {
            var admins = dbContext.Admins.AsQueryable();

            if (string.IsNullOrWhiteSpace(filterQuery) == false)
            {
                admins = admins.Where(admin => admin.Username.Contains(filterQuery));
            }

            return await admins.ToListAsync();
        }

        public async Task<Admin?> GetAdminByIdAsync(Guid id)
        {
            return await dbContext.Admins.Include(item => item.Reports).FirstOrDefaultAsync(item => item.AdminID == id);
        }

        public async Task<Admin?> GetAdminByNameAsync(string name)
        {
            return await dbContext.Admins.Include(item => item.Reports).FirstOrDefaultAsync(item => item.Username == name);
        }
    }
}
