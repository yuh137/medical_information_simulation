using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medical_Information.API.Models.DTO
{
    public class ReagentInputDTO
    {   
        public Guid ReportID { get; set; }
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