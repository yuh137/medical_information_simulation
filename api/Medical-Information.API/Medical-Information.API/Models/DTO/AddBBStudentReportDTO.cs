using System.ComponentModel.DataAnnotations.Schema;

namespace Medical_Information.API.Models.DTO
{
    public class AddBBStudentReportDTO
    {
        public Guid StudentID { get; set; }
        public Guid BloodBankQCLotID { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}