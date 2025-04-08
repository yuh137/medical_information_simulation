﻿using Medical_Information.API.Models.Domain;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Medical_Information.API.Models.DTO
{
    public class StudentReportDTO
    {
        public Guid ReportID { get; set; }
        public Guid? StudentID { get; set; }
        public Guid? AdminID { get; set; }
        public Guid AdminQCLotID { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool isResulted { get; set; }
        public ICollection<AnalyteInput> AnalyteInputs { get; set; } = [];
    }
}
