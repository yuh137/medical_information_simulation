using Medical_Information.API.Models.Domain;

namespace Medical_Information.API.Repositories.Interfaces
{
    public interface IReagentInputRepository
    {
        Task<List<ReagentInput>?> GetRInputFromStudentReportId(Guid reportId);
        Task<List<ReagentInput>?> GetRInputFromAdminReportId(Guid reportId);
        Task<List<ReagentInput>?> CreateReagentInputForStudent(List<ReagentInput> inputs, Guid reportId);
        // Task<List<AnalytReagentInputeInput>?> CreateReagentInputForAdmin(List<ReagentInput> input, Guid adminId);
    }
}