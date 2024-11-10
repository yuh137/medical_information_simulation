using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Medical_Information.API.Models.Domain
{
    public class AdminAnalyteReport
    {
        [Key]
        public Guid ReportID { get; set; }
        [ForeignKey("AdminID")]
        public Guid AdminID { get; set; }
        //public Student Student { get; set; }
        [ForeignKey("AdminQCLotID")]
        public Guid AdminQCLotID { get; set; }
        //public AdminQCLot AdminQCLot { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public ICollection<AnalyteInput> AnalyteInputs { get; set; } = [];
    }
}
