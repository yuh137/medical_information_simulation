using Medical_Information.API.Data;
using Medical_Information.API.Models.Domain;
using Medical_Information.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Medical_Information.API.Repositories.SQLImplementation
{
    public class SQLAnalyteRepository : IAnalyteRepository
    {
        private readonly MedicalInformationDbContext dbContext;

        public SQLAnalyteRepository(MedicalInformationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<Analyte?> CreateAnalyteAsync(Analyte analyte)
        {
            await dbContext.Analytes.AddAsync(analyte);
            await dbContext.SaveChangesAsync();
            return analyte;
        }

        public async Task<List<Analyte>> GetAllAnalytesAsync()
        {
            return await dbContext.Analytes.ToListAsync();
        }

        public async Task<List<Analyte>> GetAllAnalytesFromQCLotAsync(Guid QCLotID)
        {
            return await dbContext.Analytes.Where(e => e.AdminQCLotID == QCLotID).ToListAsync();
        }
    }
}
