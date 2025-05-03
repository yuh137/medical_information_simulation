using Medical_Information.API.Models.Domain;

namespace Medical_Information.API.Repositories.Interfaces
{
    public interface IAnalyteInputRepository
    {
        Task<List<AnalyteInput>?> GetAllInputFromStudentReportId(Guid reportId);
        Task<List<AnalyteInput>?> GetActiveInputFromStudentReport(Guid reportId);
        Task<List<AnalyteInput>?> GetInputFromAdminReportId(Guid reportId);
        Task<StudentReport?> UpdateOrCreateAnalyteInput(List<AnalyteInput> input, Guid studentId);
        Task<List<AnalyteInput>?> CreateAnalyteInputForAdmin(List<AnalyteInput> input, Guid adminId);
        Task<StudentReport?> UpdateAnalyteInput(List<AnalyteInput> inputs, Guid reportId);
        Task<List<AnalyteInput>> GetFacultyLeveyJenningsAnalyte(Guid userId, string lotNumber, string analyteName);
        Task<List<AnalyteInput>> GetStudentLeveyJenningsAnalyte(Guid userId, string lotNumber, string analyteName);
    }
}
