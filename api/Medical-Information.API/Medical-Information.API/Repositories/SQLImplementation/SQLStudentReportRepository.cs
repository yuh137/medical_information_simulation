using Medical_Information.API.Data;
using Medical_Information.API.Models.Domain;
using Medical_Information.API.Models.DTO;
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

        public async Task<List<StudentReport>> GetAllStudentReportsAsync()
        {
            return await dbContext.StudentReports.ToListAsync();
        }

        public async Task<StudentReport?> CreateStudentReportAsync(StudentReport report)
        {
            await dbContext.StudentReports.AddAsync(report);
            await dbContext.SaveChangesAsync();
            return report;
        }
    }
}
