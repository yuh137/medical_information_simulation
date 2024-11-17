using Medical_Information.API.Data;
using Medical_Information.API.Models.Domain;
using Medical_Information.API.Models.DTO;
using Medical_Information.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Medical_Information.API.Repositories.SQLImplementation
{
    public class SQLAnalyteInputRepository : IAnalyteInputRepository
    {
        private readonly MedicalInformationDbContext dbContext;

        public SQLAnalyteInputRepository(MedicalInformationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<List<AnalyteInput>> GetAllAnalyteInputsAsync()
        {
            return await dbContext.AnalyteInputs.ToListAsync();
        }

        public async Task<AnalyteInput?> CreateAnalyteInputAsync(AnalyteInput input)
        {
            await dbContext.AnalyteInputs.AddAsync(input);
            await dbContext.SaveChangesAsync();
            return input;
        }
    }
}
