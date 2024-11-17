﻿using Medical_Information.API.Data;
using Medical_Information.API.Models.Domain;
using Medical_Information.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Medical_Information.API.Repositories.SQLImplementation
{
    public class SQLBBStudentReportRepository : IBBStudentReportRepository
    {
        private readonly MedicalInformationDbContext dbContext;

        public SQLBBStudentReportRepository(MedicalInformationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<List<BBStudentReport>> CreateBBStudentReportAsync(List<BBStudentReport> reports)
        {
            var bloodBankQCLotIdList = new List<Guid>();

            foreach (var report in reports)
            {
                bloodBankQCLotIdList.Add(report.BloodBankQCLotID);
            }
            var adminQCLots = await dbContext.BloodBankQCLots.Where(item => bloodBankQCLotIdList.Contains(item.BloodBankQCLotID)).ToListAsync();
            var student = await dbContext.Students.FirstOrDefaultAsync(item => item.StudentID == reports[0].StudentID);   

            if (!adminQCLots.Any() || student == null)
            {
                return new List<BBStudentReport>();
            }

            foreach (var report in reports)
            {
                student.BBReports.Add(report);
                foreach (var qclot in adminQCLots)
                {
                    if (report.BloodBankQCLotID == qclot.BloodBankQCLotID)
                    {
                        qclot.Reports.Add(report);
                    }
                }
                await dbContext.BBStudentReports.AddAsync(report);
            }
            await dbContext.SaveChangesAsync();
            return reports;
        }

        public async Task<List<BBStudentReport>> GetAllBBStudentReportsAsync()
        {
            return await dbContext.BBStudentReports.Include(item => item.ReagentInputs).ToListAsync();
        }

        public async Task<BBStudentReport?> GetBBStudentReportByIdAsync(Guid id)
        {
            return await dbContext.BBStudentReports.Include(item => item.ReagentInputs).FirstOrDefaultAsync(item => item.ReportID == id);
        }

        public async Task<List<BBStudentReport>> GetBBStudentReportsByStudentIdAsync(Guid studentId)
        {
            return await dbContext.BBStudentReports.Where(item => item.StudentID == studentId).ToListAsync();
        }
    }
}