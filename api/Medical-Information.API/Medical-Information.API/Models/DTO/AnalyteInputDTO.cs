﻿namespace Medical_Information.API.Models.DTO
{
    public class AnalyteInputDTO
    {
        public Guid ReportID { get; set; }
        public string AnalyteName { get; set; }
        public string AnalyteAcronym { get; set; }
        public float AnalyteValue { get; set; }
        public bool InRange { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
