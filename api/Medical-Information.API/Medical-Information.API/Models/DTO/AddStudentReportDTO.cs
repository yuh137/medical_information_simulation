using System.ComponentModel.DataAnnotations.Schema;

namespace Medical_Information.API.Models.DTO
{
    public class AddStudentReportDTO
    {
        public Guid StudentID { get; set; }
        public Guid AdminQCLotID { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
