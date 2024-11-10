using Medical_Information.API.Data;
using Medical_Information.API.Models.Domain;
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

        public Task<List<AnalyteInput>?> CreateAnalyteInputForAdmin(List<AnalyteInput> input, Guid adminId)
        {
            throw new NotImplementedException();
        }

        public async Task<List<AnalyteInput>?> CreateAnalyteInputForStudent(List<AnalyteInput> reports, Guid studentId)
        {
            var studentReport = await dbContext.StudentReports.FirstOrDefaultAsync(item => item.ReportID == studentId);

            if (studentReport == null)
            {
                return null;
            }

            foreach ( var report in reports )
            {
                studentReport.AnalyteInputs.Add(report);
                await dbContext.AnalyteInputs.AddAsync(report);
            }
            await dbContext.SaveChangesAsync();

            return reports;
        }

        public Task<List<AnalyteInput>?> GetInputFromAdminReportId(Guid reportId)
        {
            throw new NotImplementedException();
        }

        public async Task<List<AnalyteInput>?> GetInputFromStudentReportId(Guid reportId)
        {
            var studentReport = await dbContext.StudentReports.FirstOrDefaultAsync(item => item.ReportID == reportId);

            if (studentReport == null)
            {
                return null;
            }

            return studentReport.AnalyteInputs.ToList();
        }
    }
}
