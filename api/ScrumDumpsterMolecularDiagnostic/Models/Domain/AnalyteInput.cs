using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScrumDumpsterMolecularDiagnostic.Models.Domain
{
    public class AnalyteInput
    {
        [Key]
        public Guid AnalyteInputID { get; set; }
        [ForeignKey("ReportID")]
        public Guid ReportID { get; set; }
        //public StudentReport Report { get; set; }
        public string AnalyteName { get; set; }
        public float AnalyteValue { get; set; }
    }
}
