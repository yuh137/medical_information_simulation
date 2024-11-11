using Medical_Information.API.Data;
using Medical_Information.API.Models.Domain;
using Medical_Information.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Medical_Information.API.Repositories.SQLImplementation
{
    public class SQLReagentRepository : IReagentRepository
    {
        private readonly MedicalInformationDbContext dbContext;

        public SQLReagentRepository(MedicalInformationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<Reagent?> CreateReagentAsync(Reagent reagent)
        {
            await dbContext.Reagents.AddAsync(reagent);
            await dbContext.SaveChangesAsync();
            return reagent;
        }

        public async Task<List<Reagent>> GetAllReagentsAsync()
        {
            return await dbContext.Reagents.ToListAsync();
        }

        public async Task<List<Reagent>> GetAllReagentsFromQCLotAsync(Guid QCLotID)
        {
            return await dbContext.Reagents.Include(e => e.BloodBankQCLotID).Where(e => e.BloodBankQCLotID == QCLotID).ToListAsync();
        }
    }
}
