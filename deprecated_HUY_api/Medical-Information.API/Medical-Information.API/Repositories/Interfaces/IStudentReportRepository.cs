using Medical_Information.API.Models.Domain;

namespace Medical_Information.API.Repositories.Interfaces
{
    public interface IStudentReportRepository
    {
        Task<List<StudentReport>> GetAllStudentReportsAsync();
        Task<StudentReport?> CreateStudentReportAsync(StudentReport report);
    }
}
