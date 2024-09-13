using Medical_Information.API.Enums;
using Medical_Information.API.Models.Domain;

namespace Medical_Information.API.Models.DTO
{
    public class AddAdminQCLotRequestDTO
    {
        public string LotNumber { get; set; }
        public string QCName { get; set; }
        public DateTime OpenDate { get; set; }
        public DateTime? ClosedDate { get; set; }
        public DateTime ExpirationDate { get; set; }
        public DateTime FileDate { get; set; }
        public Department Department { get; set; }
        public ICollection<AddAnalyteWithListDTO> Analytes { get; set; } = [];
    }
}
