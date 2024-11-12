using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medical_Information.API.Models.Domain
{
    public class ReagentInput
    {
        [Key]
        public Guid ReagentInputID { get; set; }
        [ForeignKey("ReportID")]
        public Guid ReportID { get; set; }
        //public StudentReport Report { get; set; }
        public string ReagentName { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? PosExpectedRange { get; set; }
        public string? NegExpectedRange { get; set; }
        public string? ImmediateSpin { get; set; }
        public string? ThirtySevenDegree { get; set; }
        public string? AHG { get; set; }
        public string? CheckCell { get; set; }
    }
}