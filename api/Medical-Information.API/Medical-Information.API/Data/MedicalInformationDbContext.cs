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
        public DbSet<AdminQCTemplate> AdminQCTemplates { get; set; }
        public DbSet<AnalyteTemplate> AnalyteTemplates { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<StudentReport> StudentReports { get; set; }
        public DbSet<AnalyteInput> AnalyteInputs { get; set; }
        public DbSet<Images> Images { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AdminQCTemplate>().HasKey(item => item.AdminQCLotID);

            modelBuilder.Entity<AdminQCTemplate>()
                .HasDiscriminator<string>("TemplateType")
                .HasValue<AdminQCTemplate>("Template")
                .HasValue<AdminQCLot>("Lot");

            modelBuilder.Entity<AnalyteTemplate>()
                .HasDiscriminator<string>("Discriminator")
                .HasValue<AnalyteTemplate>("Template")
                .HasValue<Analyte>("Analyte");

            modelBuilder.Entity<AdminQCTemplate>()
                .HasIndex(item => item.QCName)
                .IsUnique()
                .HasFilter("[TemplateType] = 'Template'");

            //modelBuilder.Entity<AdminQCTemplate>().HasMany(p => p.AnalyteTemplates).WithOne().HasForeignKey(e => e.AdminQCTemplateID).OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AnalyteTemplate>().HasOne(p => p.AdminQCTemplate).WithMany(c => c.AnalyteTemplates).HasForeignKey(a => a.AdminQCTemplateID);

            modelBuilder.Entity<Analyte>().HasOne(p => p.AdminQCLot).WithMany(c => c.Analytes).HasForeignKey(c => c.AdminQCLotID).OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<AdminQCLot>().HasMany(p => p.Reports).WithOne().HasForeignKey(e => e.AdminQCLotID).OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<AdminQCLot>().HasIndex(e => e.LotNumber).IsUnique();

            modelBuilder.Entity<Student>().HasMany(p => p.Reports).WithOne().HasForeignKey(e => e.StudentID).OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<StudentReport>().HasMany(p => p.AnalyteInputs).WithOne().HasForeignKey(e => e.ReportID).OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Admin>().HasMany(p => p.Reports).WithOne().HasForeignKey(e => e.AdminID).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
