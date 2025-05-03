using Medical_Information.API.Enums;

namespace Medical_Information.API.Models.Domain
{
    public class AdminQCTemplate
    {
        public Guid AdminQCLotID { get; set; }
        public string QCName { get; set; }
        public bool IsCustom { get; set; }
        public bool IsOrderable { get; set; }
        public Department Department { get; set; }
        public ICollection<AnalyteTemplate> AnalyteTemplates { get; set; } = [];
    }
    public class AdminQCLot : AdminQCTemplate
    {
        public string LotNumber { get; set; }
        public DateTime OpenDate { get; set; } = DateTime.Now;
        public DateTime? ClosedDate { get; set; }
        public DateTime ExpirationDate { get; set; }
        public DateTime? FileDate { get; set; } = DateTime.Now;
        public bool IsActive { get; set; }
        public ICollection<Analyte> Analytes { get; set; } = [];
        public ICollection<StudentReport> Reports { get; set; } = [];
    }
}
