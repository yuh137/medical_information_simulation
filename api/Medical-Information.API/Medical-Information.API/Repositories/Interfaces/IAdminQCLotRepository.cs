using Medical_Information.API.Enums;
using Medical_Information.API.Models.Domain;

namespace Medical_Information.API.Repositories.Interfaces
{
    public interface IAdminQCLotRepository
    {
        Task<List<AdminQCLot>> GetAllQCLotsAsync();
        Task<AdminQCLot?> GetQCLotByIDAsync(Guid id);
        Task<AdminQCLot?> GetAdminQCLotByNameAsync(string? name = null, Department? dep = null);
        Task<List<AdminQCLot>> GetAdminQCLotsByNameListAsync(List<string> names);
        Task<List<AdminQCLot>> GetAdminQCLotsByIdListAsync(List<Guid> lotId);
        Task<AdminQCLot?> DoesLotNumberExist(AdminQCLot qcLot);
        Task<AdminQCLot> CreateQCLotAsync(AdminQCLot qclot);
        Task<AdminQCLot?> UpdateQCLotAsync(Guid lotId, AdminQCLot qcLot);
        Task<AdminQCLot?> DeleteQCLotAsync(Guid id);
    }
}
