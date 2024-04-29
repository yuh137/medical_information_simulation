using Medical_Information.API.Enums;

namespace Medical_Information.API.Models.DTO
{
    public class AddAdminQCLotRequestDTO
    {
        public string LotNumber { get; set; }
        public DateTime OpenDate { get; set; }
        public DateTime? ClosedDate { get; set; }
        public Department Department { get; set; }
    }
}
