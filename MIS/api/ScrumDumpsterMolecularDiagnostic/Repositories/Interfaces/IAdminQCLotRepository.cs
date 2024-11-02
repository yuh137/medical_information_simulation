using ScrumDumpsterMolecularDiagnostic.Enums;
using ScrumDumpsterMolecularDiagnostic.Models.Domain;

namespace ScrumDumpsterMolecularDiagnostic.Repositories.Interfaces
{
    public interface IAdminQCLotRepository
    {
        Task<List<AdminQCLot>> GetAllQCLotsAsync();
        Task<AdminQCLot?> GetQCLotByIDAsync(Guid id);
        Task<AdminQCLot?> GetAdminQCLotByNameAsync(string? name = null, Department? dep = null);
        Task<AdminQCLot?> DoesLotNumberExist(AdminQCLot qcLot);
        Task<AdminQCLot> CreateQCLotAsync(AdminQCLot qclot);
        Task<AdminQCLot?> UpdateQCLotAsync(Guid lotId, AdminQCLot qcLot);
        Task<AdminQCLot?> DeleteQCLotAsync(Guid id);
    }
}
