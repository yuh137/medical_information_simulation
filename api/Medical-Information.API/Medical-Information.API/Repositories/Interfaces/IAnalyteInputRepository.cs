using Medical_Information.API.Models.Domain;

namespace Medical_Information.API.Repositories.Interfaces
{
    public interface IAnalyteInputRepository
    {
        Task<List<AnalyteInput>> GetAllAnalyteInputsAsync();
        Task<AnalyteInput?> CreateAnalyteInputAsync(AnalyteInput input);
    }
}
