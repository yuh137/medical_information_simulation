using Medical_Information.API.Models.Domain;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medical_Information.API.Models.DTO
{
    public class AdminAnalyteReportDTO
    {
        public Guid ReportID { get; set; }
        public Guid AdminID { get; set; }
        public Guid AdminQCLotID { get; set; }
        public DateTime CreatedDate { get; set; }
        public ICollection<AnalyteInput> AnalyteInputs { get; set; }
    }
}
