using Medical_Information.API.Models.Domain;

namespace Medical_Information.API.Repositories.Interfaces
{
    public interface IReagentRepository
    {
        Task<List<Reagent>> GetAllReagentsAsync();
        Task<Reagent?> CreateReagentAsync(Reagent reagent);
        Task<List<Reagent>> GetAllReagentsFromQCLotAsync(Guid QCLotID);
    }
}
