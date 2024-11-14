using Medical_Information.API.Enums;
using Medical_Information.API.Models.Domain;

namespace Medical_Information.API.Repositories.Interfaces
{
    public interface IBloodBankQCLotRepository
    {
        Task<List<BloodBankQCLot>> GetAllBBQCLotsAsync();
        Task<List<BloodBankQCLot>> GetBBQCLotsByNameListAsync(List<string> names);
        Task<BloodBankQCLot?> GetBBQCLotByIDAsync(Guid id);
        Task<BloodBankQCLot> CreateBBQCLotAsync(BloodBankQCLot qclot);
        Task<BloodBankQCLot?> DeleteBBQCLotAsync(Guid id);
        Task<List<BloodBankQCLot>> GetBBQCLotsByIdListAsync(List<Guid> lotId);
    }
}