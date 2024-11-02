using Medical_Information.API.Models.Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Medical_Information.API.Data
{
    public class MedicalInformationDbContext : DbContext
    {
        public MedicalInformationDbContext(DbContextOptions<MedicalInformationDbContext> dbContextOptions) : base(dbContextOptions)
        {
            
        }

        public DbSet<Admin> Admins { get; set; }
        public DbSet<AdminQCLot> AdminQCLots { get; set; }
        public DbSet<Analyte> Analytes { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<StudentReport> StudentReports { get; set; }
        public DbSet<AnalyteInput> AnalyteInputs { get; set; }
        public DbSet<Images> Images { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AdminQCLot>().HasMany(p => p.Analytes).WithOne().HasForeignKey(e => e.AdminQCLotID);

            modelBuilder.Entity<AdminQCLot>().HasMany(p => p.Reports).WithOne().HasForeignKey(e => e.AdminQCLotID);

            modelBuilder.Entity<AdminQCLot>().HasIndex(e => e.LotNumber).IsUnique();

            //modelBuilder.Entity<Analyte>().HasOne(e => e.AdminQCLot).WithMany(e => e.Analytes).HasForeignKey(e => e.AdminQCLotID);

            modelBuilder.Entity<Student>().HasMany(p => p.Reports).WithOne().HasForeignKey(e => e.StudentID);

            modelBuilder.Entity<StudentReport>().HasMany(p => p.AnalyteInputs).WithOne().HasForeignKey(e => e.ReportID);

            //Seed data for Analytes
            var mockQCLot = new AdminQCLot()
            {
                AdminQCLotID = Guid.Parse("bbb59aca-6c27-424c-852f-21656a88f449"),
                QCName = "CMP Level I",
                LotNumber = "888888888888",
                OpenDate = DateTime.Now,
                Department = Enums.Department.Chemistry,
                //Analytes = [],
            };

            var analytes = new List<Analyte>()
            {
                new Analyte
                {
                    AnalyteID = Guid.Parse("b05e9c30-3f03-4fad-a703-ad532bd39ae5"),
                    AnalyteName = "Sodium",
                    AnalyteAcronym = "Na",
                    UnitOfMeasure = "mEq/L",
                    MinLevel = 0,
                    MaxLevel = 0,
                    Mean = 0,
                    StdDevi = 0,
                    AdminQCLotID = mockQCLot.AdminQCLotID,
                    //AdminQCLot = mockQCLot,
                },
                new Analyte
                {
                    AnalyteID = Guid.Parse("ce5ba2a7-6543-4f81-b906-64599b274f97"),
                    AnalyteName = "Potassium",
                    AnalyteAcronym = "K",
                    UnitOfMeasure = "mEq/L",
                    MinLevel = 0,
                    MaxLevel = 0,
                    Mean = 0,
                    StdDevi = 0,
                    AdminQCLotID = mockQCLot.AdminQCLotID,
                    //AdminQCLot = mockQCLot,
                },
                new Analyte
                {
                    AnalyteID = Guid.Parse("46baac82-7390-4139-b4ae-9c284de63860"),
                    AnalyteName = "Chloride",
                    AnalyteAcronym = "Cl",
                    UnitOfMeasure = "mEq/L",
                    MinLevel = 0,
                    MaxLevel = 0,
                    Mean = 0,
                    StdDevi = 0,
                    AdminQCLotID = mockQCLot.AdminQCLotID,
                    //AdminQCLot = mockQCLot,
                },
                new Analyte
                {
                    AnalyteID = Guid.Parse("6e52026c-5cc5-4175-b476-29a1f5bd4c02"),
                    AnalyteName = "Carbon Dioxide",
                    AnalyteAcronym = "CO_2",
                    UnitOfMeasure = "mEq/L",
                    MinLevel = 0,
                    MaxLevel = 0,
                    Mean = 0,
                    StdDevi = 0,
                    AdminQCLotID = mockQCLot.AdminQCLotID,
                    //AdminQCLot = mockQCLot,
                },
                new Analyte
                {
                    AnalyteID = Guid.Parse("9d5b1c89-7b7e-4c1f-b0c7-1d8b1d4f3587"),
                    AnalyteName = "Blood Urea Nitrogen",
                    AnalyteAcronym = "BUN",
                    UnitOfMeasure = "mg/dL",
                    MinLevel = 0,
                    MaxLevel = 0,
                    Mean = 0,
                    StdDevi = 0,
                    AdminQCLotID = mockQCLot.AdminQCLotID,
                    //AdminQCLot = mockQCLot,
                },
                new Analyte
                {
                    AnalyteID = Guid.Parse("e01c6f52-07ab-4995-88de-bb83072aef5a"),
                    AnalyteName = "Creatinine",
                    AnalyteAcronym = "CREA",
                    UnitOfMeasure = "mg/dL",
                    MinLevel = 0,
                    MaxLevel = 0,
                    Mean = 0,
                    StdDevi = 0,
                    AdminQCLotID = mockQCLot.AdminQCLotID,
                    //AdminQCLot = mockQCLot,
                },
                new Analyte
                {
                    AnalyteID = Guid.Parse("b886f8d0-798d-4c0f-aa91-4e5b2f6f0a07"),
                    AnalyteName = "Calcium",
                    AnalyteAcronym = "CA",
                    UnitOfMeasure = "mg/dL",
                    MinLevel = 0,
                    MaxLevel = 0,
                    Mean = 0,
                    StdDevi = 0,
                    AdminQCLotID = mockQCLot.AdminQCLotID,
                    //AdminQCLot = mockQCLot,
                },
                new Analyte
                {
                    AnalyteID = Guid.Parse("f5012c5e-4d05-46ff-b6fd-4c53789bafdb"),
                    AnalyteName = "Glucose",
                    AnalyteAcronym = "GLU",
                    UnitOfMeasure = "mg/dL",
                    MinLevel = 0,
                    MaxLevel = 0,
                    Mean = 0,
                    StdDevi = 0,
                    AdminQCLotID = mockQCLot.AdminQCLotID,
                    //AdminQCLot = mockQCLot,
                },
                new Analyte
                {
                    AnalyteID = Guid.Parse("a50e49c0-c80d-4347-a2d4-186f22c7bb3f"),
                    AnalyteName = "Albumin",
                    AnalyteAcronym = "ALB",
                    UnitOfMeasure = "g/dL",
                    MinLevel = 0,
                    MaxLevel = 0,
                    Mean = 0,
                    StdDevi = 0,
                    AdminQCLotID = mockQCLot.AdminQCLotID,
                    //AdminQCLot = mockQCLot,
                },
                new Analyte
                {
                    AnalyteID = Guid.Parse("f3033c25-0d20-41db-89a9-69b6bb66f2d2"),
                    AnalyteName = "Alanine Aminotransferase",
                    AnalyteAcronym = "ALT",
                    UnitOfMeasure = "U/L",
                    MinLevel = 0,
                    MaxLevel = 0,
                    Mean = 0,
                    StdDevi = 0,
                    AdminQCLotID = mockQCLot.AdminQCLotID,
                    //AdminQCLot = mockQCLot,
                },
                new Analyte
                {
                    AnalyteID = Guid.Parse("9cf3ff8a-208d-4b05-b108-3e4fb82f2b7f"),
                    AnalyteName = "Aspartate Aminotransferase",
                    AnalyteAcronym = "AST",
                    UnitOfMeasure = "U/L",
                    MinLevel = 0,
                    MaxLevel = 0,
                    Mean = 0,
                    StdDevi = 0,
                    AdminQCLotID = mockQCLot.AdminQCLotID,
                    //AdminQCLot = mockQCLot,
                },
                new Analyte
                {
                    AnalyteID = Guid.Parse("6a14f038-4f68-488a-93bb-0f1c9f33f09a"),
                    AnalyteName = "Akaline Phosphatse",
                    AnalyteAcronym = "ALP",
                    UnitOfMeasure = "U/L",
                    MinLevel = 0,
                    MaxLevel = 0,
                    Mean = 0,
                    StdDevi = 0,
                    AdminQCLotID = mockQCLot.AdminQCLotID,
                    //AdminQCLot = mockQCLot,
                },
                new Analyte
                {
                    AnalyteID = Guid.Parse("e783a56d-5fc4-4a8e-8509-aa99b0e64b1c"),
                    AnalyteName = "Bilirubin",
                    AnalyteAcronym = "BIL",
                    UnitOfMeasure = "mg/dL",
                    MinLevel = 0,
                    MaxLevel = 0,
                    Mean = 0,
                    StdDevi = 0,
                    AdminQCLotID = mockQCLot.AdminQCLotID,
                    //AdminQCLot = mockQCLot,
                },
                new Analyte
                {
                    AnalyteID = Guid.Parse("d614a66d-fc2d-4518-bb0f-1787ed48f5c1"),
                    AnalyteName = "Total Protein",
                    AnalyteAcronym = "TP",
                    UnitOfMeasure = "mg/dL",
                    MinLevel = 0,
                    MaxLevel = 0,
                    Mean = 0,
                    StdDevi = 0,
                    AdminQCLotID = mockQCLot.AdminQCLotID,
                    //AdminQCLot = mockQCLot,
                },
            };

            modelBuilder.Entity<AdminQCLot>().HasData(mockQCLot);

            modelBuilder.Entity<Analyte>().HasData(analytes);
        }
    }
}
