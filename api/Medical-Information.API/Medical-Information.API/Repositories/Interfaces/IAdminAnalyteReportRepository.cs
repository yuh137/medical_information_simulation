using Medical_Information.API.Models.Domain;

namespace Medical_Information.API.Repositories.Interfaces
{
    public interface IAdminAnalyteReportRepository
    {
        Task<List<AdminAnalyteReport>> GetAllAdminReportsAsync();
        Task<AdminAnalyteReport?> GetAdminReportByIdAsync(Guid id);
        Task<List<AdminAnalyteReport>> CreateAdminReportAsync(List<AdminAnalyteReport> reports);
        Task<List<AdminAnalyteReport>> GetAdminReportsByAdminIdAsync(Guid adminId);
    }
}
