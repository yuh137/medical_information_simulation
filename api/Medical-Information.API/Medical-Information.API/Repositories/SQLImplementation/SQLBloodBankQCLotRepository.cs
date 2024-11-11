using Medical_Information.API.Data;
using Medical_Information.API.Models.Domain;
using Medical_Information.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Medical_Information.API.Repositories.SQLImplementation
{
    public class SQLBloodBankQCLotRepository : IBloodBankQCLotRepository
    {
        private readonly MedicalInformationDbContext dbContext;
        private readonly MedicalInformationAuthDbContext authContext;

        public SQLBloodBankQCLotRepository(MedicalInformationDbContext dbContext, MedicalInformationAuthDbContext authContext)
        {
            this.dbContext = dbContext;
            this.authContext = authContext;
        }
        public async Task<BloodBankQCLot> CreateBBQCLotAsync(BloodBankQCLot qclot)
        {
            await dbContext.BloodBankQCLots.AddAsync(qclot);
            await dbContext.SaveChangesAsync();
            return qclot;
        }

        public async Task<BloodBankQCLot?> DeleteBBQCLotAsync(Guid id)
        {
            var exisitingQCLot = await dbContext.BloodBankQCLots.FirstOrDefaultAsync(item => item.BloodBankQCLotID == id);

            if (exisitingQCLot == null) { return null; }

            dbContext.BloodBankQCLots.Remove(exisitingQCLot);
            await dbContext.SaveChangesAsync();

            return exisitingQCLot;
        }

        public async Task<List<BloodBankQCLot>> GetAllBBQCLotsAsync()
        {
            return await dbContext.BloodBankQCLots.ToListAsync();   
            // return await dbContext.BloodBankQCLots.Include(item => item.Analytes).Include(item => item.Reports).ToListAsync();
        }

        public async Task<BloodBankQCLot?> GetBBQCLotByIDAsync(Guid id)
        {
            return await dbContext.BloodBankQCLots.FirstOrDefaultAsync(item => item.BloodBankQCLotID == id);
        // return await dbContext.BloodBankQCLots.Include(item => item.Analytes).Include(item => item.Reports).FirstOrDefaultAsync(item => item.AdminQCLotID == id);
    }
    }
}
