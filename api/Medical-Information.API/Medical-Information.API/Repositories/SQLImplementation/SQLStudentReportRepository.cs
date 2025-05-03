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
                if (report.AdminQCLotID.HasValue)
                {
                    adminQCLotIdList.Add(report.AdminQCLotID.Value);
                } else
                {
                    continue;
                }
            }

            var adminQCLots = await dbContext.AdminQCTemplates.OfType<AdminQCLot>().Where(item => adminQCLotIdList.Contains(item.AdminQCLotID)).ToListAsync();

            var student = await dbContext.Students.FirstOrDefaultAsync(item => item.StudentID == reports[0].StudentID);

            var admin = await dbContext.Admins.FirstOrDefaultAsync(item => item.AdminID == reports[0].AdminID);

            if (!adminQCLots.Any() || (student == null && admin == null))
            {
                return new List<StudentReport>();
            }

            if (student != null && admin == null)
            {
                foreach ( var report in reports )
                {
                    student.Reports.Add(report);
                    foreach ( var qclot in adminQCLots )
                    {
                        if (report.AdminQCLotID == qclot.AdminQCLotID) qclot.Reports.Add(report);
                    }
                    await dbContext.StudentReports.AddAsync(report);
                }
            } 
            else if (admin != null && student == null)
            {
                foreach (var report in reports)
                {
                    admin.Reports.Add(report);
                    foreach (var qclot in adminQCLots)
                    {
                        if (report.AdminQCLotID == qclot.AdminQCLotID) qclot.Reports.Add(report);
                    }
                    await dbContext.StudentReports.AddAsync(report);
                }
            } else
            {
                return reports;
            }
            await dbContext.SaveChangesAsync();
            return reports;
        }

        public async Task<StudentReport?> DeleteStudentReportByID(Guid reportId)
        {
            var existingReport = await dbContext.StudentReports.FirstOrDefaultAsync(item => item.ReportID == reportId);

            if (existingReport == null)
            {
                return null;
            }

            dbContext.StudentReports.Remove(existingReport);
            await dbContext.SaveChangesAsync();

            return existingReport;
        }

        public async Task<List<StudentReport>> GetAllStudentReportsAsync()
        {
            return await dbContext.StudentReports.Include(item => item.AnalyteInputs).ToListAsync();
        }

        public async Task<StudentReport?> GetStudentReportByIdAsync(Guid id)
        {
            return await dbContext.StudentReports.Include(item => item.AnalyteInputs).FirstOrDefaultAsync(item => item.ReportID == id);
        }

        public async Task<List<StudentReport>> GetStudentReportsByAdminIdAsync(Guid adminId)
        {
            return await dbContext.StudentReports.Where(item => item.AdminID == adminId).ToListAsync();
        }

        public async Task<List<StudentReport>> GetStudentReportsByStudentIdAsync(Guid studentId)
        {
            return await dbContext.StudentReports.Where(item => item.StudentID == studentId).ToListAsync();
        }

        public async Task<List<StudentReport>> GetUnFilledReportsByAdminId(Guid adminId)
        {
            return await dbContext.StudentReports.Where(item => item.AdminID == adminId && item.isResulted == false).ToListAsync();
        }

        public async Task<List<StudentReport>> GetUnFilledReportsByStudentId(Guid studentId)
        {
            return await dbContext.StudentReports.Where(item => item.StudentID == studentId && item.isResulted == false).ToListAsync();
        }

        public async Task<StudentReport?> ResultCurrentReport(Guid reportId)
        {
            var report = await dbContext.StudentReports.FirstOrDefaultAsync(item => item.ReportID == reportId);

            if (report == null)
            {
                return null;
            }

            report.isResulted = true;
            await dbContext.SaveChangesAsync();

            return report;
        }
    }
}
