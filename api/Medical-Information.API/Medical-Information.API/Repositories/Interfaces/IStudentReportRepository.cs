using Medical_Information.API.Models.Domain;

namespace Medical_Information.API.Repositories.Interfaces
{
    public interface IStudentReportRepository
    {
        Task<List<StudentReport>> GetAllStudentReportsAsync();
        Task<StudentReport?> GetStudentReportByIdAsync(Guid id);
        Task<List<StudentReport>> CreateStudentReportAsync(List<StudentReport> reports);
        Task<List<StudentReport>> GetStudentReportsByStudentIdAsync(Guid studentId);
        Task<List<StudentReport>> GetStudentReportsByAdminIdAsync(Guid adminId);
        Task<StudentReport?> ResultCurrentReport(Guid reportId);
        Task<List<StudentReport>> GetUnFilledReportsByAdminId(Guid adminId);
        Task<List<StudentReport>> GetUnFilledReportsByStudentId(Guid studentId);
        Task<StudentReport?> DeleteStudentReportByID(Guid reportId);
    }
}
