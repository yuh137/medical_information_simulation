using Medical_Information.API.Enums;
using Medical_Information.API.Models.Domain;
using System.ComponentModel.DataAnnotations;

namespace Medical_Information.API.Models.DTO
{
    public class AnalyteInputDTO
    {
        public Guid ReportID { get; set; }
        public string AnalyteName { get; set; }
        public string AnalyteValue { get; set; }
    }

    public class AddAnalyteInputWithListDTO
    {
        public string AnalyteName { get; set; }
        public string AnalyteValue { get; set; }
    }
}
