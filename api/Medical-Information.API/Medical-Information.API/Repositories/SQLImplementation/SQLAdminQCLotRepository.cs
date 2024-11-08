using Medical_Information.API.Data;
using Medical_Information.API.Enums;
using Medical_Information.API.Models.Domain;
using Medical_Information.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Runtime.Intrinsics.Arm;

namespace Medical_Information.API.Repositories.SQLImplementation
{
    public class SQLAdminQCLotRepository : IAdminQCLotRepository
    {
        private readonly MedicalInformationDbContext dbContext;
        private readonly MedicalInformationAuthDbContext authContext;

        public SQLAdminQCLotRepository(MedicalInformationDbContext dbContext, MedicalInformationAuthDbContext authContext)
        {
            this.dbContext = dbContext;
            this.authContext = authContext;
        }
        public async Task<AdminQCLot> CreateQCLotAsync(AdminQCLot qclot)
        {
            var activeQCLot = await dbContext.AdminQCLots.Where(item => item.Department == qclot.Department && item.QCName.ToLower() == qclot.QCName.ToLower() && item.IsActive).FirstOrDefaultAsync();

            if (activeQCLot != null)
            {
                activeQCLot.IsActive = false;
                activeQCLot.ClosedDate = DateTime.Now;
                dbContext.Update(activeQCLot);
            }

            await dbContext.AdminQCLots.AddAsync(qclot);
            await dbContext.SaveChangesAsync();
            return qclot;
        }

        public async Task<AdminQCLot?> DeleteQCLotAsync(Guid id)
        {
            var exisitingQCLot = await dbContext.AdminQCLots.FirstOrDefaultAsync(item => item.AdminQCLotID == id);

            if (exisitingQCLot == null) { return null; }

            dbContext.AdminQCLots.Remove(exisitingQCLot);
            await dbContext.SaveChangesAsync();

            return exisitingQCLot;
        }

        public async Task<AdminQCLot?> DoesLotNumberExist(AdminQCLot qcLot)
        {
            return await dbContext.AdminQCLots.FirstOrDefaultAsync(item => item.LotNumber == qcLot.LotNumber);
        }

        public async Task<AdminQCLot?> GetAdminQCLotByNameAsync(string? name, Department? dep)
        {
            var QCLot = dbContext.AdminQCLots.AsQueryable();

            if (!string.IsNullOrEmpty(name) && dep != null && Enum.IsDefined(typeof(Department), dep))
            {
                QCLot = QCLot.Where(item => item.QCName.ToLower() == name.ToLower() && item.Department == dep && item.IsActive);
            }

            return await QCLot.Include(item => item.Analytes).FirstOrDefaultAsync();
        }

        public async Task<List<AdminQCLot>> GetAllQCLotsAsync()
        {
            return await dbContext.AdminQCLots.Include(item => item.Analytes).Include(item => item.Reports).ToListAsync();
        }

        public async Task<AdminQCLot?> GetQCLotByIDAsync(Guid id)
        {
            return await dbContext.AdminQCLots.Include(item => item.Analytes).Include(item => item.Reports).FirstOrDefaultAsync(item => item.AdminQCLotID == id);
        }

        public async Task<AdminQCLot?> UpdateQCLotAsync(Guid lotId, AdminQCLot qcLot)
        {
            var existingQCLot = await dbContext.AdminQCLots.Include(e => e.Analytes).FirstOrDefaultAsync(item => item.AdminQCLotID == lotId);

            if (existingQCLot == null)
            {
                return null;
            }

            existingQCLot.ExpirationDate = qcLot.ExpirationDate;
            existingQCLot.OpenDate = qcLot.OpenDate;
            existingQCLot.ClosedDate = qcLot.ClosedDate;
            existingQCLot.FileDate = qcLot.FileDate;

            foreach (var analyte in qcLot.Analytes)
            {
                var existingAnalyte = existingQCLot.Analytes.SingleOrDefault(item => item.AnalyteName == analyte.AnalyteName);

                if (existingAnalyte != null)
                {
                    existingAnalyte.MaxLevel = analyte.MaxLevel;
                    existingAnalyte.MinLevel = analyte.MinLevel;
                    existingAnalyte.UnitOfMeasure = analyte.UnitOfMeasure;
                    existingAnalyte.Mean = analyte.Mean;
                    existingAnalyte.ExpectedRange = analyte.ExpectedRange;
                }
            }

            await dbContext.SaveChangesAsync();

            return existingQCLot;
        }
    }
}
