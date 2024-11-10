using Medical_Information.API.Models.Domain;

namespace Medical_Information.API.Repositories.Interfaces
{
    public interface IAnalyteInputRepository
    {
        Task<List<AnalyteInput>?> GetInputFromStudentReportId(Guid reportId);
        Task<List<AnalyteInput>?> GetInputFromAdminReportId(Guid reportId);
        Task<List<AnalyteInput>?> CreateAnalyteInputForStudent(List<AnalyteInput> input, Guid studentId);
        Task<List<AnalyteInput>?> CreateAnalyteInputForAdmin(List<AnalyteInput> input, Guid adminId);
    }
}
