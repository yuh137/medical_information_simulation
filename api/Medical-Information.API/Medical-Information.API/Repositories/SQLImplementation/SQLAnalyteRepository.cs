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
        public async Task<Analyte?> CreateAnalyte(Analyte analyte)
        {
            await dbContext.AnalyteTemplates.AddAsync(analyte);
            await dbContext.SaveChangesAsync();
            return analyte;
        }

        public async Task<List<Analyte>> GetAllAnalytes()
        {
            return await dbContext.AnalyteTemplates.OfType<Analyte>().ToListAsync();
        }

        public async Task<List<Analyte>> GetAllAnalytesFromQCLot(Guid QCLotID)
        {
            return await dbContext.AnalyteTemplates.OfType<Analyte>().Where(e => e.AdminQCLotID == QCLotID).ToListAsync();
        }

        public async Task<List<Analyte>> GetAllAnalytesFromQCLotByLotNumber(string lotNum)
        {
            var qcLot = await dbContext.AdminQCTemplates.OfType<AdminQCLot>().Include(e => e.Analytes).FirstOrDefaultAsync(e => e.LotNumber == lotNum);

            if (qcLot == null)
            {
                return new List<Analyte>();
            }

            return qcLot.Analytes.ToList();
        }

        public async Task<List<AnalyteTemplate>> GetAllAnalyteTemplates()
        {
            return await dbContext.AnalyteTemplates.OfType<AnalyteTemplate>().ToListAsync();
        }
    }
}
