using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Medical_Information.API.Enums;

namespace Medical_Information.API.Models.Domain
{
    public class Analyte
    {
        [Key]
        public Guid AnalyteID { get; set; }
        public string AnalyteName { get; set; }
        public string AnalyteAcronym { get; set; }
        public AnalyteType Type { get; set; }
        public string? UnitOfMeasure { get; set; }
        public float? MinLevel { get; set; }
        public float? MaxLevel { get; set; }
        public float? Mean { get; set; }
        public float? StdDevi { get; set; }
        public string? ExpectedRange { get; set; }
        [ForeignKey("AdminQCLotID")]
        public Guid AdminQCLotID { get; set; }
    }
}
