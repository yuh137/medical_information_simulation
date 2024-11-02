using Medical_Information.API.Models.Domain;

namespace Medical_Information.API.Repositories.Interfaces
{
    public interface IAnalyteRepository
    {
        Task<List<Analyte>> GetAllAnalytesAsync();
        Task<Analyte?> CreateAnalyteAsync(Analyte analyte);
        Task<List<Analyte>> GetAllAnalytesFromQCLotAsync(Guid QCLotID);
    }
}
