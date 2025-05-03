using Medical_Information.API.Enums;
using Medical_Information.API.Models.Domain;

namespace Medical_Information.API.Repositories.Interfaces
{
    public interface IAdminQCLotRepository
    {
        Task<List<AdminQCLot>> GetAllQCLots();
        Task<List<AdminQCTemplate>> GetAllQCTemplates();
        Task<List<AdminQCLot>> GetQCLotsHistoryByName(string? name = null, Department? dep = null);
        Task<AdminQCLot?> GetQCLotByID(Guid id);
        Task<List<AdminQCLot>> GetAllCustomQCLots();
        Task<List<AdminQCTemplate>> GetAllCustomTemplates();
        Task<AdminQCLot?> GetAdminQCLotByName(string? name = null, Department? dep = null);
        Task<AdminQCTemplate?> GetTemplateByName(string? name = null, Department? dep = null);
        Task<List<string>> GetAllUniqueCustomLotsName();
        Task<List<AdminQCLot>> GetAdminQCLotsByNameList(List<string> names);
        Task<List<AdminQCLot>> GetAdminQCLotsByIdList(List<Guid> lotId);
        Task<AdminQCLot?> GetAdminQCLotByLotNumber(string lotNumber);
        Task<AdminQCLot?> DoesLotNumberExist(AdminQCLot qcLot);
        Task<AdminQCLot> CreateQCLot(AdminQCLot qclot);
        Task<AdminQCTemplate?> CreateQCTemplate(AdminQCTemplate qcTemplate);
        //Task<AdminQCLot?> CreateCustomQCLot(AdminQCLot qclot);
        Task<AdminQCLot?> UpdateQCLot(Guid lotId, AdminQCLot qcLot);
        Task<AdminQCTemplate?> SetIsOrderable(Guid lotId, bool isOrderable);
        Task<AdminQCLot?> InactivateQCLot(Guid lotId);
        //Task<AdminQCLot?> ActivateCustomQCLot(Guid lotId);
        Task<AdminQCLot?> DeleteQCLot(Guid id);
        Task<AdminQCTemplate?> DeleteCustomTemplate(Guid id);
    }
}
