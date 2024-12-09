using Medical_Information.API.Data;
using Medical_Information.API.Models.Domain;
using Medical_Information.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Medical_Information.API.Repositories.SQLImplementation
{
    public class SQLAdminAnalyteReportRepository : IAdminAnalyteReportRepository
    {
        private readonly MedicalInformationDbContext dbContext;

        public SQLAdminAnalyteReportRepository(MedicalInformationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<List<AdminAnalyteReport>> CreateAdminReportAsync(List<AdminAnalyteReport> reports)
        {
            var adminQCLotIdList = new List<Guid>();

            foreach (var report in reports)
            {
                adminQCLotIdList.Add(report.AdminQCLotID);
            }

            var adminQCLots = await dbContext.AdminQCLots.Where(item => adminQCLotIdList.Contains(item.AdminQCLotID)).ToListAsync();

            var admin = await dbContext.Admins.FirstOrDefaultAsync(item => item.AdminID == reports[0].AdminID);

            if (!adminQCLots.Any() || admin == null)
            {
                return new List<AdminAnalyteReport>();
            }

            foreach (var report in reports)
            {
                admin.Reports.Add(report);
                foreach (var qclot in adminQCLots)
                {
                    if (report.AdminQCLotID == qclot.AdminQCLotID) qclot.AdminReports.Add(report);
                }
                await dbContext.AdminAnalyteReports.AddAsync(report);
            }
            await dbContext.SaveChangesAsync();
            return reports;
        }

        public async Task<AdminAnalyteReport?> GetAdminReportByIdAsync(Guid id)
        {
            return await dbContext.AdminAnalyteReports.FirstOrDefaultAsync(item => item.ReportID == id);
        }

        public async Task<List<AdminAnalyteReport>> GetAdminReportsByAdminIdAsync(Guid adminId)
        {
            return await dbContext.AdminAnalyteReports.Where(item => item.AdminID == adminId).ToListAsync();
        }

        public async Task<List<AdminAnalyteReport>> GetAllAdminReportsAsync()
        {
            return await dbContext.AdminAnalyteReports.Include(item => item.AnalyteInputs).ToListAsync();
        }
    }
}
