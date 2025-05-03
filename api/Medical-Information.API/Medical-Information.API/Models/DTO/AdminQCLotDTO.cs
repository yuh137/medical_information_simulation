using Medical_Information.API.Enums;
using Medical_Information.API.Models.Domain;

namespace Medical_Information.API.Models.DTO
{
    public class AdminQCLotDTO
    {
        public Guid AdminQCLotID { get; set; }
        public string QCName { get; set; }
        public string LotNumber { get; set; }
        public DateTime OpenDate { get; set; }
        public DateTime? ClosedDate { get; set; }
        public DateTime? FileDate { get; set; }
        public DateTime ExpirationDate { get; set; }
        public bool IsActive { get; set; }
        public bool IsCustom { get; set; }
        public bool IsOrderable { get; set; }
        public Department Department { get; set; }
        public ICollection<AnalyteDTO> Analytes { get; set; } = [];
        public ICollection<StudentReportDTO> Reports { get; set; } = [];
    }

    public class AdminQCTemplateDTO
    {
        public Guid AdminQCLotID { get; set; }
        public string QCName { get; set; }
        public bool IsCustom { get; set; }
        public bool IsOrderable { get; set; }
        public Department Department { get; set; }
        public ICollection<AnalyteTemplate> AnalyteTemplates { get; set; } = [];
    }
}
