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
                dbContext.AdminQCLots.Update(activeQCLot);
            }

            await dbContext.AdminQCLots.AddAsync(qclot);
            await dbContext.SaveChangesAsync();
            return qclot;
        }

        public async Task<AdminQCLot?> CreateCustomQCLot(AdminQCLot qclot)
        {
            if (!qclot.IsCustom)
            {
                return null;
            }

            var existingQcLot = await dbContext.AdminQCLots.Where(item => item.QCName.ToLower() == qclot.QCName.ToLower()).FirstOrDefaultAsync();

            if (existingQcLot != null)
            {
                return null;
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

        public async Task<AdminQCLot?> GetAdminQCLotByLotNumber(string lotNumber)
        {
            return await dbContext.AdminQCLots.Include(item => item.Analytes).FirstOrDefaultAsync(item => item.LotNumber ==  lotNumber);
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
        public async Task<List<string>> GetAllUniqueCustomLotsName()
        {
            var existingCustomLots = await GetAllCustomQCLots();

            if (!existingCustomLots.Any())
            {
                return [];
            }

            var uniqueNameList = existingCustomLots.GroupBy(item => item.QCName).Select(group => group.Key).ToList();

            return uniqueNameList;
        }

        public async Task<List<AdminQCLot>> GetAdminQCLotsByIdListAsync(List<Guid> lotId)
        {
            return await dbContext.AdminQCLots.Include(item => item.Analytes).Where(item => lotId.Contains(item.AdminQCLotID)).ToListAsync();
        }

        public async Task<List<AdminQCLot>> GetAdminQCLotsByNameListAsync(List<string> names)
        {
            foreach ( var name in names)
            {
                name.ToLower();
            }
            return await dbContext.AdminQCLots.Include(item => item.Analytes).Include(item => item.Reports).Where(item => names.Contains(item.QCName.ToLower()) && item.IsActive).ToListAsync();
        }

        public async Task<List<AdminQCLot>> GetAllQCLotsAsync()
        {
            return await dbContext.AdminQCLots.Include(item => item.Analytes).Include(item => item.Reports).ToListAsync();
        }

        public async Task<List<AdminQCLot>> GetQCLotsHistoryByNameAsync(string? name, Department? dep)
        {
            var QCLots = dbContext.AdminQCLots.AsQueryable();

            if (!string.IsNullOrEmpty(name) && dep != null && Enum.IsDefined(typeof(Department), dep))
            {
                QCLots = QCLots.Where(item => item.QCName.ToLower() == name.ToLower() && item.Department == dep);
            }

            return await QCLots.Include(item => item.Analytes).ToListAsync();
        }

        public async Task<AdminQCLot?> GetQCLotByIDAsync(Guid id)
        {
            return await dbContext.AdminQCLots.Include(item => item.Analytes).Include(item => item.Reports).FirstOrDefaultAsync(item => item.AdminQCLotID == id);
        }

        public async Task<AdminQCLot?> UpdateQCLotAsync(Guid lotId, AdminQCLot qcLot)
        {
            var existingQCLot = await dbContext.AdminQCLots.Include(e => e.Analytes).Include(item => item.Reports).FirstOrDefaultAsync(item => item.AdminQCLotID == lotId);

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
                    existingAnalyte.StdDevi = analyte.StdDevi;
                }
            }

            await dbContext.SaveChangesAsync();

            return existingQCLot;
        }

        public async Task<AdminQCLot?> InactivateQCLotAsync(Guid lotId)
        {
            var existingQCLot = await dbContext.AdminQCLots.FirstOrDefaultAsync(item => item.AdminQCLotID == lotId);

            if (existingQCLot == null)
            {
                return null;
            }

            existingQCLot.IsActive = false;
            await dbContext.SaveChangesAsync();

            return existingQCLot;
        }

        public async Task<List<AdminQCLot>> GetAllCustomQCLots()
        {
            return await dbContext.AdminQCLots.Where(item => item.IsCustom == true).ToListAsync();
        }

        public async Task<AdminQCLot?> ActivateCustomQCLot(Guid lotId)
        {
            var existingCustomLot = await dbContext.AdminQCLots.FirstOrDefaultAsync(item => item.AdminQCLotID == lotId && item.IsCustom == true);

            if (existingCustomLot == null)
            {
                return null;
            }

            existingCustomLot.IsActive = true;
            await dbContext.SaveChangesAsync();

            return existingCustomLot;
        }
    }
}
