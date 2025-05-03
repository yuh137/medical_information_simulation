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

        public SQLAdminQCLotRepository(MedicalInformationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<AdminQCLot> CreateQCLot(AdminQCLot qclot)
        {
            var activeQCLot = await dbContext.AdminQCTemplates.OfType<AdminQCLot>().Where(item => item.Department == qclot.Department && item.QCName.ToLower() == qclot.QCName.ToLower() && item.IsActive).FirstOrDefaultAsync();

            if (activeQCLot != null)
            {
                activeQCLot.IsActive = false;
                activeQCLot.ClosedDate = DateTime.Now;
                dbContext.AdminQCTemplates.Update(activeQCLot);
            }

            await dbContext.AdminQCTemplates.AddAsync(qclot);
            await dbContext.SaveChangesAsync();
            return qclot;
        }

        public async Task<AdminQCTemplate?> CreateQCTemplate(AdminQCTemplate qcTemplate)
        {
            //var existingTemplate = await dbContext.AdminQCTemplates.FirstOrDefaultAsync(item => item.QCName == qcTemplate.QCName);

            //if (existingTemplate != null)
            //{
            //    return null;
            //}

            await dbContext.AdminQCTemplates.AddAsync(qcTemplate);
            await dbContext.SaveChangesAsync();
            return qcTemplate;
        }

        //public async Task<AdminQCLot?> CreateCustomQCLot(AdminQCLot qclot)
        //{
        //    if (!qclot.IsCustom)
        //    {
        //        return null;
        //    }

        //    var existingQcLot = await dbContext.AdminQCTemplates.Where(item => item.QCName.ToLower() == qclot.QCName.ToLower()).FirstOrDefaultAsync();

        //    if (existingQcLot != null)
        //    {
        //        return null;
        //    }

        //    await dbContext.AdminQCTemplates.AddAsync(qclot);
        //    await dbContext.SaveChangesAsync();
        //    return qclot;
        //}

        public async Task<AdminQCLot?> DeleteQCLot(Guid id)
        {
            var existingQCLot = await dbContext.AdminQCTemplates.OfType<AdminQCLot>().Include(s => s.Analytes).Include(s => s.Reports).ThenInclude(c => c.AnalyteInputs).FirstOrDefaultAsync(item => EF.Property<string>(item, "TemplateType") == "Lot" && item.AdminQCLotID == id);

            if (existingQCLot == null) { return null; }

            dbContext.AnalyteInputs.RemoveRange(existingQCLot.Reports.SelectMany(r => r.AnalyteInputs));
            dbContext.StudentReports.RemoveRange(existingQCLot.Reports);

            var existingTemplate = await GetTemplateByName(existingQCLot.QCName, existingQCLot.Department);

            if (existingQCLot.IsCustom && existingTemplate == null)
            {
                dbContext.AnalyteTemplates.RemoveRange(existingQCLot.Analytes);
                dbContext.AdminQCTemplates.Remove(existingQCLot);
            }


            //dbContext.AnalyteTemplates.RemoveRange(existingQCLot.Analytes);
            //dbContext.AdminQCTemplates.Remove(existingQCLot);
            await dbContext.SaveChangesAsync();
            return existingQCLot;
        }

        

        public async Task<AdminQCLot?> DoesLotNumberExist(AdminQCLot qcLot)
        {
            return await dbContext.AdminQCTemplates.OfType<AdminQCLot>().FirstOrDefaultAsync(item => item.LotNumber == qcLot.LotNumber);
        }

        public async Task<AdminQCLot?> GetAdminQCLotByLotNumber(string lotNumber)
        {
            return await dbContext.AdminQCTemplates.OfType<AdminQCLot>().Include(item => item.Analytes).FirstOrDefaultAsync(item => item.LotNumber == lotNumber);
        }

        public async Task<AdminQCLot?> GetAdminQCLotByName(string? name, Department? dep)
        {
            var QCLot = dbContext.AdminQCTemplates.OfType<AdminQCLot>().AsQueryable();

            if (!string.IsNullOrEmpty(name) && dep != null && Enum.IsDefined(typeof(Department), dep))
            {
                QCLot = QCLot.Where(item => item.QCName.ToLower() == name.ToLower() && item.Department == dep && item.IsActive);
            }

            return await QCLot.Include(item => item.Analytes).FirstOrDefaultAsync();
        }
        public async Task<List<string>> GetAllUniqueCustomLotsName()
        {
            var existingCustomLots = await GetAllCustomTemplates();

            if (!existingCustomLots.Any())
            {
                return [];
            }

            var uniqueNameList = existingCustomLots.Where(item => item.IsOrderable).GroupBy(item => item.QCName).Select(group => group.Key).ToList();

            return uniqueNameList;
        }

        public async Task<List<AdminQCLot>> GetAdminQCLotsByIdList(List<Guid> lotId)
        {
            return await dbContext.AdminQCTemplates.OfType<AdminQCLot>().Include(item => item.Analytes).Where(item => lotId.Contains(item.AdminQCLotID)).ToListAsync();
        }

        public async Task<List<AdminQCLot>> GetAdminQCLotsByNameList(List<string> names)
        {
            foreach (var name in names)
            {
                name.ToLower();
            }
            return await dbContext.AdminQCTemplates.OfType<AdminQCLot>().Include(item => item.Analytes).Include(item => item.Reports).Where(item => names.Contains(item.QCName.ToLower()) && item.IsActive).ToListAsync();
        }

        public async Task<List<AdminQCLot>> GetAllQCLots()
        {
            return await dbContext.AdminQCTemplates.OfType<AdminQCLot>().Include(item => item.Analytes).Include(item => item.Reports).ToListAsync();
        }

        public async Task<List<AdminQCLot>> GetQCLotsHistoryByName(string? name, Department? dep)
        {
            var QCLots = dbContext.AdminQCTemplates.OfType<AdminQCLot>().AsQueryable();

            if (!string.IsNullOrEmpty(name) && dep != null && Enum.IsDefined(typeof(Department), dep))
            {
                QCLots = QCLots.Where(item => item.QCName.ToLower() == name.ToLower() && item.Department == dep);
            }

            return await QCLots.Include(item => item.Analytes).ToListAsync();
        }

        public async Task<AdminQCLot?> GetQCLotByID(Guid id)
        {
            return await dbContext.AdminQCTemplates.OfType<AdminQCLot>().Include(item => item.Analytes).Include(item => item.Reports).FirstOrDefaultAsync(item => item.AdminQCLotID == id);
        }

        public async Task<AdminQCLot?> UpdateQCLot(Guid lotId, AdminQCLot qcLot)
        {
            var existingQCLot = await dbContext.AdminQCTemplates.OfType<AdminQCLot>().Include(e => e.Analytes).Include(item => item.Reports).FirstOrDefaultAsync(item => item.AdminQCLotID == lotId);

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

        public async Task<AdminQCLot?> InactivateQCLot(Guid lotId)
        {
            var existingQCLot = await dbContext.AdminQCTemplates.OfType<AdminQCLot>().FirstOrDefaultAsync(item => item.AdminQCLotID == lotId);

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
            return await dbContext.AdminQCTemplates.OfType<AdminQCLot>().Where(item => EF.Property<string>(item, "TemplateType") == "Lot" && item.IsCustom == true).ToListAsync();
        }

        public async Task<List<AdminQCTemplate>> GetAllQCTemplates()
        {
            return await dbContext.AdminQCTemplates.Where(e => EF.Property<string>(e, "TemplateType") == "Template").Include(item => item.AnalyteTemplates).ToListAsync();
        }

        public async Task<AdminQCTemplate?> GetTemplateByName(string? name = null, Department? dep = null)
        {
            var QCTemplate = dbContext.AdminQCTemplates.Where(e => EF.Property<string>(e, "TemplateType") == "Template").Include(item => item.AnalyteTemplates).AsQueryable();

            if (!string.IsNullOrEmpty(name) && dep != null && Enum.IsDefined(typeof(Department), dep))
            {
                QCTemplate = QCTemplate.Where(item => item.QCName.ToLower() == name.ToLower() && item.Department == dep);
            }

            return await QCTemplate.FirstOrDefaultAsync();
        }

        public async Task<List<AdminQCTemplate>> GetAllCustomTemplates()
        {
            return await dbContext.AdminQCTemplates.Where(e => EF.Property<string>(e, "TemplateType") == "Template" && e.IsCustom).Include(item => item.AnalyteTemplates).ToListAsync();
        }

        public async Task<AdminQCTemplate?> SetIsOrderable(Guid lotId, bool isOrderable)
        {
            var qcLot = await dbContext.AdminQCTemplates.FirstOrDefaultAsync(item => EF.Property<string>(item, "TemplateType") == "Template" && item.AdminQCLotID == lotId && item.IsCustom == true);

            if (qcLot == null)
            {
                return null;
            }

            qcLot.IsOrderable = isOrderable;
            await dbContext.SaveChangesAsync();

            return qcLot;
        }

        public async Task<AdminQCTemplate?> DeleteCustomTemplate(Guid id)
        {
            var existingTemplate = await dbContext.AdminQCTemplates.Include(item => item.AnalyteTemplates).FirstOrDefaultAsync(item => EF.Property<string>(item, "TemplateType") == "Template" && item.AdminQCLotID == id && item.IsCustom);

            if (existingTemplate == null)
            {
                return null;
            }

            var existingLots = await dbContext.AdminQCTemplates.OfType<AdminQCLot>().Where(item => EF.Property<string>(item, "TemplateType") == "Lot" && item.QCName == existingTemplate.QCName && item.IsCustom).ToListAsync();

            foreach (var lot in existingLots)
            {
                lot.IsActive = false;
                lot.IsOrderable = false;
                dbContext.Update(lot);
            }

            dbContext.RemoveRange(existingTemplate.AnalyteTemplates);
            dbContext.Remove(existingTemplate);
            await dbContext.SaveChangesAsync();

            return existingTemplate;
        }
    }
}