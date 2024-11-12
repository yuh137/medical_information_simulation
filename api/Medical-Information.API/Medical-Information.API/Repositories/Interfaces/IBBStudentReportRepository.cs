using Medical_Information.API.Models.Domain;

namespace Medical_Information.API.Repositories.Interfaces
{
    public interface IBBStudentReportRepository
    {
        Task<List<BBStudentReport>> GetAllBBStudentReportsAsync();
        Task<BBStudentReport?> GetBBStudentReportByIdAsync(Guid id);
        Task<List<BBStudentReport>> CreateBBStudentReportAsync(List<BBStudentReport> reports);
        Task<List<BBStudentReport>> GetBBStudentReportsByStudentIdAsync(Guid studentId);
    }
}
