using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Medical_Information.API.Models.Domain
{
    public class AnalyteTemplate
    {
        [Key]
        public Guid AnalyteID { get; set; }
        public string AnalyteName { get; set; }
        public string AnalyteAcronym { get; set; }
        public string UnitOfMeasure { get; set; }
        public Guid? AdminQCTemplateID { get; set; }
        [JsonIgnore]
        public AdminQCTemplate AdminQCTemplate { get; set; }
    }
    public class Analyte : AnalyteTemplate
    {
        public float MinLevel { get; set; }
        public float MaxLevel { get; set; }
        public float Mean { get; set; }
        public float StdDevi { get; set; }
        public Guid? AdminQCLotID { get; set; }
        [JsonIgnore]
        public AdminQCLot AdminQCLot { get; set; }
    }
}
