﻿using Medical_Information.API.Models.Domain;

namespace Medical_Information.API.Repositories.Interfaces
{
    public interface IAdminQCLotRepository
    {
        Task<List<AdminQCLot>> GetAllQCLotsAsync();
        Task<AdminQCLot?> GetQCLotByIDAsync(Guid id);
        Task<AdminQCLot> CreateQCLotAsync(AdminQCLot qclot);
        Task<AdminQCLot?> DeleteQCLotAsync(Guid id);
    }
}
