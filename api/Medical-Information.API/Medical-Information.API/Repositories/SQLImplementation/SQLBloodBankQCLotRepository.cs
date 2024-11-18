using Medical_Information.API.Data;
using Medical_Information.API.Enums;
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

        public async Task<List<BloodBankQCLot>> GetBBQCLotsByNameListAsync(List<string> names)
        {
            foreach (var name in names)
            {
                name.ToLower();
            }
            return await dbContext.BloodBankQCLots.Include(item => item.Reagents).Include(item => item.Reports).Where(item => names.Contains(item.QCName.ToLower()) && item.IsActive).ToListAsync();  // && item.IsActive
        }

        public async Task<List<BloodBankQCLot>> GetBBQCLotsByIdListAsync(List<Guid> lotId)
        {
            return await dbContext.BloodBankQCLots.Where(item => lotId.Contains(item.BloodBankQCLotID) && item.IsActive).ToListAsync();
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
            return await dbContext.BloodBankQCLots.Include(item => item.Reagents).FirstOrDefaultAsync(item => item.BloodBankQCLotID == id);
        // return await dbContext.BloodBankQCLots.Include(item => item.Analytes).Include(item => item.Reports).FirstOrDefaultAsync(item => item.AdminQCLotID == id);
        }
        public async Task<BloodBankQCLot?> GetBBQCLotByNameAsync(string name)
        {
            return await dbContext.BloodBankQCLots.Include(item => item.Reagents).FirstOrDefaultAsync(item => item.QCName == name);
        }

        public async Task<BloodBankQCLot?> UpdateBBQCLotAsync(Guid lotId, BloodBankQCLot qcLot)
        {
            var existingQCLot = await dbContext.BloodBankQCLots.Include(e => e.Reagents).Include(item => item.Reports).FirstOrDefaultAsync(item => item.BloodBankQCLotID == lotId);

            if (existingQCLot == null)
            {
                return null;
            }

            existingQCLot.LotNumber = qcLot.LotNumber;
            existingQCLot.ExpirationDate = qcLot.ExpirationDate;
            existingQCLot.OpenDate = qcLot.OpenDate;
            existingQCLot.ClosedDate = qcLot.ClosedDate;
            existingQCLot.FileDate = qcLot.FileDate;
            existingQCLot.IsActive = qcLot.IsActive;

            foreach (var reagent in qcLot.Reagents)
            {
                var existingReagent = existingQCLot.Reagents.SingleOrDefault(item => item.ReagentName == reagent.ReagentName);

                if (existingReagent != null)
                {
                    existingReagent.ReagentName = reagent.ReagentName;
                    existingReagent.Abbreviation = reagent.Abbreviation;
                    existingReagent.ReagentLotNum = reagent.ReagentLotNum;
                    existingReagent.ExpirationDate = reagent.ExpirationDate;
                    existingReagent.PosExpectedRange = reagent.PosExpectedRange;
                    existingReagent.NegExpectedRange = reagent.NegExpectedRange;
                    existingReagent.AHG = reagent.AHG;
                    existingReagent.CheckCell = reagent.CheckCell;
                    existingReagent.ImmediateSpin = reagent.ImmediateSpin;
                    existingReagent.ThirtySevenDegree = reagent.ThirtySevenDegree;
                }
            }

            await dbContext.SaveChangesAsync();

            return existingQCLot;
        }
    }
}
