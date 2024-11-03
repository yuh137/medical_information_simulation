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
        }
    }
}
