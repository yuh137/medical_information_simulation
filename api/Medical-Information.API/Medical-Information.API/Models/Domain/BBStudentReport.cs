using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medical_Information.API.Models.Domain
{
    public class BBStudentReport
    {
        [Key]
        public Guid ReportID { get; set; }
        [ForeignKey("StudentID")]
        public Guid StudentID { get; set; }
        //public Student Student { get; set; }
        [ForeignKey("BloodBankQCLotID")]
        public Guid BloodBankQCLotID { get; set; }
        //public BloodBankQCLot BloodBankQCLot { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public ICollection<ReagentInput> ReagentInputs { get; set; } = [];
    }
}
