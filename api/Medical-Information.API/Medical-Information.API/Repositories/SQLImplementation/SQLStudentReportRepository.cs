using Medical_Information.API.Data;
using Medical_Information.API.Models.Domain;
using Medical_Information.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Medical_Information.API.Repositories.SQLImplementation
{
    public class SQLStudentReportRepository : IStudentReportRepository
    {
        private readonly MedicalInformationDbContext dbContext;

        public SQLStudentReportRepository(MedicalInformationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<List<StudentReport>> CreateStudentReportAsync(List<StudentReport> reports)
        {
            var adminQCLotIdList = new List<Guid>();

            foreach ( var report in reports )
            {
                adminQCLotIdList.Add(report.AdminQCLotID);
            }

            var adminQCLots = await dbContext.AdminQCLots.Where(item => adminQCLotIdList.Contains(item.AdminQCLotID)).ToListAsync();

            var student = await dbContext.Students.FirstOrDefaultAsync(item => item.StudentID == reports[0].StudentID);

            if (!adminQCLots.Any() || student == null)
            {
                return new List<StudentReport>();
            }

            foreach ( var report in reports )
            {
                student.Reports.Add(report);
                foreach ( var qclot in adminQCLots )
                {
                    if (report.AdminQCLotID == qclot.AdminQCLotID) qclot.Reports.Add(report);
                }
                await dbContext.StudentReports.AddAsync(report);
            }
            await dbContext.SaveChangesAsync();
            return reports;
        }

        public async Task<List<StudentReport>> GetAllStudentReportsAsync()
        {
            return await dbContext.StudentReports.Include(item => item.AnalyteInputs).ToListAsync();
        }

        public async Task<StudentReport?> GetStudentReportByIdAsync(Guid id)
        {
            return await dbContext.StudentReports.Include(item => item.AnalyteInputs).FirstOrDefaultAsync(item => item.ReportID == id);
        }

        public async Task<List<StudentReport>> GetStudentReportsByStudentIdAsync(Guid studentId)
        {
            return await dbContext.StudentReports.Where(item => item.StudentID == studentId).ToListAsync();
        }
    }
}
