using ScrumDumpsterMolecularDiagnostic.Models.Domain;
using ScrumDumpsterMolecularDiagnostic.Models.DTO;

namespace ScrumDumpsterMolecularDiagnostic.Repositories.Interfaces
{
    public interface IStudentRepository
    {
        Task<List<Student>> GetAllStudentsAsync();
        Task<Student> CreateStudentAsync(Student student);
        Task<Student?> GetStudentByIDAsync(Guid id);
        Task<Student?> GetStudentByNameAsync(string name);
        Task<Student?> DeleteStudentAsync(Guid id);
    }
}
