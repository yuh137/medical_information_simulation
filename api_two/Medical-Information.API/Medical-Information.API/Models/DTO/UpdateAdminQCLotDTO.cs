using Medical_Information.API.Models.Domain;

namespace Medical_Information.API.Models.DTO
{
    public class UpdateAdminQCLotDTO
    {
        public DateTime? OpenDate { get; set; }
        public DateTime? ClosedDate { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public DateTime? FileDate { get; set; }
        public List<Analyte> Analytes { get; set; }
    }
}
