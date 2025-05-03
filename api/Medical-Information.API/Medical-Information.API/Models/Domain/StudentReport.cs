using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medical_Information.API.Models.Domain
{
    public class StudentReport
    {
        [Key]
        public Guid ReportID { get; set; }
        [ForeignKey("StudentID")]
        public Guid? StudentID { get; set; }
        [ForeignKey("AdminID")]
        public Guid? AdminID { get; set; }
        //public Student Student { get; set; }
        [ForeignKey("AdminQCLotID")]
        public Guid? AdminQCLotID { get; set; }
        //public AdminQCLot AdminQCLot { get; set; }
        public bool isResulted { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public ICollection<AnalyteInput> AnalyteInputs { get; set; } = [];
    }
}
