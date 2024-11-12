using Medical_Information.API.Models.Domain;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Medical_Information.API.Models.DTO
{
    public class BBStudentReportDTO
    {
        public Guid ReportID { get; set; }
        public Guid StudentID { get; set; }
        public Guid BloodBankQCLotID { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public ICollection<ReagentInput> ReagentInputs { get; set; } = [];
    }
}
