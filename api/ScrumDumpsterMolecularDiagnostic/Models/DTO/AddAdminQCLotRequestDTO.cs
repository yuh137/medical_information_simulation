using ScrumDumpsterMolecularDiagnostic.Enums;
using ScrumDumpsterMolecularDiagnostic.Models.Domain;
using System.ComponentModel.DataAnnotations;

namespace ScrumDumpsterMolecularDiagnostic.Models.DTO
{
    public class AddAdminQCLotRequestDTO
    {
        [Required]
        [MinLength(8, ErrorMessage = "Minimum 8 Characters")]
        public string LotNumber { get; set; }
        [Required]
        public string QCName { get; set; }
        public DateTime OpenDate { get; set; }
        public DateTime? ClosedDate { get; set; }
        public DateTime ExpirationDate { get; set; }
        public DateTime FileDate { get; set; }
        public bool IsActive { get; set; } = true;
        public Department Department { get; set; }
        public ICollection<AddAnalyteWithListDTO> Analytes { get; set; } = [];
    }
}
