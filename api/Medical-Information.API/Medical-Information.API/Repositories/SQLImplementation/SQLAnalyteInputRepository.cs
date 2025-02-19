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

        public async Task<StudentReport?> UpdateOrCreateAnalyteInput(List<AnalyteInput> values, Guid studentId)
        {
            var studentReport = await dbContext.StudentReports.Include(item => item.AnalyteInputs).FirstOrDefaultAsync(item => item.ReportID == studentId);

            if (studentReport == null)
            {
                return null;
            }

            foreach ( var value in values )
            {
                var existingAnalyteInput = studentReport.AnalyteInputs.FirstOrDefault(item => item.AnalyteName == value.AnalyteName && item.IsActive);

                if (existingAnalyteInput != null)
                {
                    existingAnalyteInput.IsActive = false;
                }

                studentReport.AnalyteInputs.Add(value);
                //await dbContext.AnalyteInputs.AddAsync(value);
            }
            await dbContext.SaveChangesAsync();

            return studentReport;
        }

        public Task<List<AnalyteInput>?> GetInputFromAdminReportId(Guid reportId)
        {
            throw new NotImplementedException();
        }

        public async Task<List<AnalyteInput>?> GetAllInputFromStudentReportId(Guid reportId)
        {
            var studentReport = await dbContext.StudentReports.Include(item => item.AnalyteInputs).FirstOrDefaultAsync(item => item.ReportID == reportId);

            if (studentReport == null)
            {
                return null;
            }

            return studentReport.AnalyteInputs.ToList();
        }

        public async Task<StudentReport?> UpdateAnalyteInput(List<AnalyteInput> inputs, Guid reportId)
        {
            var studentReport = await dbContext.StudentReports.Include(item => item.AnalyteInputs).FirstOrDefaultAsync(item => item.ReportID == reportId);

            if (studentReport == null)
            {
                return null;
            }

            foreach (var input in inputs)
            {
                var existingAnalyteInput = studentReport.AnalyteInputs.FirstOrDefault(item => item.AnalyteName == input.AnalyteName && item.IsActive);

                if (existingAnalyteInput != null)
                {
                    existingAnalyteInput.IsActive = false;
                }

                studentReport.AnalyteInputs.Add(input);
                //await dbContext.AnalyteInputs.AddAsync(input);
            }

            await dbContext.SaveChangesAsync();
            return studentReport;
        }

        public async Task<List<AnalyteInput>?> GetActiveInputFromStudentReport(Guid reportId)
        {
            var studentReport = await dbContext.StudentReports.Include(item => item.AnalyteInputs).FirstOrDefaultAsync(item => item.ReportID == reportId);

            if (studentReport == null)
            {
                return null;
            }

            var activeAnalyteInputs = new List<AnalyteInput>();

            foreach (var analyteInput in studentReport.AnalyteInputs)
            {
                if (analyteInput.IsActive) activeAnalyteInputs.Add(analyteInput);
            }

            return activeAnalyteInputs;
        }
    }
}
