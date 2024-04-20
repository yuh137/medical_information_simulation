using Medical_Information.API.Enums;

namespace Medical_Information.API.Models.Domain
{
    public class AdminQCLot
    {
        public Guid AdminQCLotID { get; set; }
        public string LotNumber { get; set; }
        public DateTime OpenDate { get; set; }
        public DateTime? ClosedDate { get; set; }
        public Department Department { get; set; }
        public ICollection<Analyte> Analytes { get; set; } = [];
    }
}
