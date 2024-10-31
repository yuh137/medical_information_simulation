using ScrumDumpsterMolecularDiagnostic.Models.Domain;

namespace ScrumDumpsterMolecularDiagnostic.Repositories.Interfaces
{
    public interface IStudentReportRepository
    {
        Task<List<StudentReport>> GetAllStudentReportsAsync();
        Task<StudentReport?> CreateStudentReportAsync(StudentReport report);
    }
}
