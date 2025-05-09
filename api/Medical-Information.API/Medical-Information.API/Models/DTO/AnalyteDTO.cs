﻿namespace Medical_Information.API.Models.DTO
{
    public class AnalyteTemplateDTO
    {
        public string AnalyteName { get; set; }
        public string AnalyteAcronym { get; set; }
        public string UnitOfMeasure { get; set; }
        public Guid? AdminQCTemplateID { get; set; }
    }
    public class AnalyteDTO
    {
        public Guid AnalyteID { get; set; }
        public string AnalyteName { get; set; }
        public string AnalyteAcronym { get; set; }
        public string UnitOfMeasure { get; set; }
        public float MinLevel { get; set; }
        public float MaxLevel { get; set; }
        public float Mean { get; set; }
        public float StdDevi { get; set; }
        public Guid AdminQCLotID { get; set; }
    }
    public class AddAnalyteTemplateWithListDTO
    {
        public string AnalyteName { get; set; }
        public string AnalyteAcronym { get; set; }
        public string UnitOfMeasure { get; set; }
    }

    public class AddAnalyteWithListDTO
    {
        public string AnalyteName { get; set; }
        public string AnalyteAcronym { get; set; }
        public string UnitOfMeasure { get; set; }
        public float MinLevel { get; set; }
        public float MaxLevel { get; set; }
        public float Mean { get; set; }
        public float StdDevi { get; set; }
    }

    public class AddAnalyteAloneDTO
    {
        public string AnalyteName { get; set; }
        public string AnalyteAcronym { get; set; }
        public string UnitOfMeasure { get; set; }
        public float MinLevel { get; set; }
        public float MaxLevel { get; set; }
        public float Mean { get; set; }
        public float StdDevi { get; set; }
        public Guid AdminQCLotID { get; set; }
    }
}
