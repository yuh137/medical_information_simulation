using Medical_Information.API.Data;
using Medical_Information.API.Models.Domain;
using Medical_Information.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Medical_Information.API.Repositories.SQLImplementation
{
    public class SQLAdminQCLotRepository : IAdminQCLotRepository
    {
        private readonly MedicalInformationDbContext dbContext;

        public SQLAdminQCLotRepository(MedicalInformationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<AdminQCLot> CreateQCLotAsync(AdminQCLot qclot)
        {
            await dbContext.AdminQCLots.AddAsync(qclot);
            await dbContext.SaveChangesAsync();
            return qclot;
        }

        public async Task<AdminQCLot?> DeleteQCLotAsync(Guid id)
        {
            var exisitingQCLot = await dbContext.AdminQCLots.FirstOrDefaultAsync(item => item.AdminQCLotID == id);

            if (exisitingQCLot == null) { return null; }

            dbContext.AdminQCLots.Remove(exisitingQCLot);
            await dbContext.SaveChangesAsync();

            return exisitingQCLot;
        }

        public async Task<List<AdminQCLot>> GetAllQCLotsAsync()
        {
            return await dbContext.AdminQCLots.Include(item => item.Analytes).ToListAsync();
        }

        public async Task<AdminQCLot?> GetQCLotByIDAsync(Guid id)
        {
            return await dbContext.AdminQCLots.FirstOrDefaultAsync(item => item.AdminQCLotID == id);
        }
    }
}
