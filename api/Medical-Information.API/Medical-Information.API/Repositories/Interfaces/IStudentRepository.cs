using Medical_Information.API.Models.Domain;
using Medical_Information.API.Models.DTO;

namespace Medical_Information.API.Repositories.Interfaces
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
