using ScrumDumpsterMolecularDiagnostic.Data;
using ScrumDumpsterMolecularDiagnostic.Models.Domain;
using ScrumDumpsterMolecularDiagnostic.Models.DTO;
using ScrumDumpsterMolecularDiagnostic.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ScrumDumpsterMolecularDiagnostic.Repositories.SQLImplementation
{
    public class SQLStudentRepository : IStudentRepository
    {
        private readonly MedicalInformationDbContext dbContext;

        public SQLStudentRepository(MedicalInformationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<Student> CreateStudentAsync(Student student)
        {
            await dbContext.Students.AddAsync(student);
            await dbContext.SaveChangesAsync();
            return student;
        }

        public async Task<Student?> DeleteStudentAsync(Guid id)
        {
            var existingStudent = await dbContext.Students.FirstOrDefaultAsync(item => item.StudentID == id);
            if (existingStudent == null)
            {
                return null;
            }

            dbContext.Students.Remove(existingStudent);
            await dbContext.SaveChangesAsync();
            return existingStudent;
        }

        public async Task<List<Student>> GetAllStudentsAsync()
        {
            return await dbContext.Students.ToListAsync();
        }

        public async Task<Student?> GetStudentByIDAsync(Guid id)
        {
            return await dbContext.Students.FirstOrDefaultAsync(item => item.StudentID == id);
        }

        public async Task<Student?> GetStudentByNameAsync(string name)
        {
            return await dbContext.Students.FirstOrDefaultAsync(item => item.Username == name);
        }
    }
}
