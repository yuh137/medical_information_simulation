using Medical_Information.API.Enums;

namespace Medical_Information.API.Models.Domain
{
    public class BloodBankQCLot
    {
        public Guid BloodBankQCLotID { get; set; }
        public string QCName { get; set; }
        public string LotNumber { get; set; }
        public DateTime OpenDate { get; set; } = DateTime.Now;
        public DateTime? ClosedDate { get; set; }
        public DateTime ExpirationDate { get; set; } = DateTime.Now.AddMonths(1);
        public DateTime? FileDate { get; set; } = DateTime.Now;
        public bool IsActive { get; set; } = true;
        public ICollection<Reagent> Reagents { get; set; } = [];
        public ICollection<BBStudentReport> Reports { get; set; } = [];
    }
}
