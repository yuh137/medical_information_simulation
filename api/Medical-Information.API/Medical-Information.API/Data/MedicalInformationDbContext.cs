using Medical_Information.API.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace Medical_Information.API.Data
{
    public class MedicalInformationDbContext : DbContext
    {
        public MedicalInformationDbContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
        {
            
        }

        public DbSet<Admin> Admins { get; set; }
        public DbSet<AdminQCLot> AdminQCLots { get; set; }
        public DbSet<Analyte> Analytes { get; set; }
        public DbSet<Student> Students { get; set; }
    }
}
