using Medical_Information.API.Models.Domain;

namespace Medical_Information.API.Repositories.Interfaces
{
    public interface IAnalyteRepository
    {
        Task<List<Analyte>> GetAllAnalytes();
        Task<List<AnalyteTemplate>> GetAllAnalyteTemplates();
        Task<Analyte?> CreateAnalyte(Analyte analyte);
        Task<List<Analyte>> GetAllAnalytesFromQCLot(Guid QCLotID);
        Task<List<Analyte>> GetAllAnalytesFromQCLotByLotNumber(string lotNum);
    }
}
