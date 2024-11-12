
using Medical_Information.API.Enums;
using Medical_Information.API.Models.Domain;

namespace Medical_Information.API.Models.DTO
{
    public class BloodBankQCLotDTO
    {
        public Guid BloodBankQCLotID { get; set; }
        public string QCName { get; set; }
        public string LotNumber { get; set; }
        public DateTime OpenDate { get; set; } = DateTime.Now;
        public DateTime? ClosedDate { get; set; }
        public DateTime ExpirationDate { get; set; } = DateTime.Now.AddMonths(1);
        public DateTime? FileDate { get; set; } = DateTime.Now;
        public bool IsActive { get; set; } = false;
        public ICollection<Reagent> Reagents { get; set; } = [];
        public ICollection<BBStudentReport> Reports { get; set; } = [];
    }
}
