using Medical_Information.API.Models.Domain;

namespace Medical_Information.API.Repositories.Interfaces
{
    public interface IStudentReportRepository
    {
        Task<List<StudentReport>> GetAllStudentReportsAsync();
        Task<StudentReport?> GetStudentReportByIdAsync(Guid id);
        Task<List<StudentReport>> CreateStudentReportAsync(List<StudentReport> reports);
        Task<List<StudentReport>> GetStudentReportsByStudentIdAsync(Guid studentId);
    }
}
