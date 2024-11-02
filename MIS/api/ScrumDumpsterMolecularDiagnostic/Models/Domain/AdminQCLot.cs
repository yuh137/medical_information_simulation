using ScrumDumpsterMolecularDiagnostic.Enums;

namespace ScrumDumpsterMolecularDiagnostic.Models.Domain
{
    public class AdminQCLot
    {
        public Guid AdminQCLotID { get; set; }
        public string QCName { get; set; }
        public string LotNumber { get; set; }
        public DateTime OpenDate { get; set; } = DateTime.Now;
        public DateTime? ClosedDate { get; set; }
        public DateTime ExpirationDate { get; set; }
        public DateTime? FileDate { get; set; } = DateTime.Now;
        public bool IsActive { get; set; }
        public Department Department { get; set; }
        public ICollection<Analyte> Analytes { get; set; } = [];
        public ICollection<StudentReport> Reports { get; set; } = [];
    }
}
