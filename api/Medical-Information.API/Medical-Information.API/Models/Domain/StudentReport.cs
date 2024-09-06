using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medical_Information.API.Models.Domain
{
    public class StudentReport
    {
        [Key]
        public Guid ReportID { get; set; }
        [ForeignKey("StudentID")]
        public Guid StudentID { get; set; }
        [ForeignKey("AdminQCLotID")]
        public Guid AdminQCLotID { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
