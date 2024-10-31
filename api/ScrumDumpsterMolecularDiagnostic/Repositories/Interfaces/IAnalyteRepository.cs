using ScrumDumpsterMolecularDiagnostic.Models.Domain;

namespace ScrumDumpsterMolecularDiagnostic.Repositories.Interfaces
{
    public interface IAnalyteRepository
    {
        Task<List<Analyte>> GetAllAnalytesAsync();
        Task<Analyte?> CreateAnalyteAsync(Analyte analyte);
        Task<List<Analyte>> GetAllAnalytesFromQCLotAsync(Guid QCLotID);
    }
}
