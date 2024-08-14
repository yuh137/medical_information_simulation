using Medical_Information.API.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medical_Information.API.Models.Domain
{
    public class OrderedTest
    {
        [Key]
        public Guid TestID { get; set; }
        [Required]
        public string LotNumber { get; set; }
        [Required]
        public DateTime OpenDate { get; set; }
        public DateTime? ClosedDate { get; set; }
        [Required]
        public DateTime ExpirationDate { get; set; }
        public DateTime FileDate { get; set; }
        [Required]
        public Department Department { get; set; }
        [ForeignKey("Student")]
        public Guid StudentID { get; set; }
        public ICollection<Analyte> Analytes { get; set; } = [];
        public ICollection<double>? AnalyteValues { get; set; } = [];
    }
}
