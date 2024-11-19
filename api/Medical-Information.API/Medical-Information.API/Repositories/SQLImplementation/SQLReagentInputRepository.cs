using Medical_Information.API.Data;
using Medical_Information.API.Models.Domain;
using Medical_Information.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Medical_Information.API.Repositories.SQLImplementation
{
    public class SQLReagentInputRepository : IReagentInputRepository
    {
        private readonly MedicalInformationDbContext dbContext;

        public SQLReagentInputRepository(MedicalInformationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<List<ReagentInput>?> CreateReagentInputForStudent(List<ReagentInput> inputs, Guid reportId)
        {
            var studentReport = await dbContext.BBStudentReports.FirstOrDefaultAsync(item => item.ReportID == reportId);

            if (studentReport == null)
            {
                return null;
            }

            foreach (var input in inputs)
            {
                studentReport.ReagentInputs.Add(input);
                await dbContext.ReagentInputs.AddAsync(input);
            }
            await dbContext.SaveChangesAsync();

            return inputs;
        }

        public Task<List<ReagentInput>?> GetRInputFromAdminReportId(Guid reportId)
        {
            throw new NotImplementedException();
        }

        public async Task<List<ReagentInput>?> GetRInputFromStudentReportId(Guid reportId)
        {
            var studentReport = await dbContext.BBStudentReports.FirstOrDefaultAsync(item => item.ReportID == reportId);

            if (studentReport == null)
            {
                return null;
            }

            return studentReport.ReagentInputs.ToList();
        }
    }
}