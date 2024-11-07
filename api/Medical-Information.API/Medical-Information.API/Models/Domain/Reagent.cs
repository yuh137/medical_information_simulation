using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medical_Information.API.Models.Domain
{
    public class Reagent
    {
        [Key]
        public Guid ReagentID { get; set; }
        public string ReagentName { get; set; }
        public string Abbreviation { get; set; }
        public string ReagentLotNum { get; set; }
        public DateTime ExpirationDate { get; set; }
        public bool PosExpectedRange { get; set; }
        public bool NegExpectedRange { get; set; }
        public Guid BloodBankQCLotID { get; set; }
        //public AdminQCLot AdminQCLot { get; set; }
    }
}
