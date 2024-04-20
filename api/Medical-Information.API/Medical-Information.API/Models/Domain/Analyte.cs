namespace Medical_Information.API.Models.Domain
{
    public class Analyte
    {
        public Guid AnalyteID { get; set; }
        public string AnalyteName { get; set; }
        public string AnalyteAcronym { get; set; }
        public string UnitOfMeasure { get; set; }
        public string MinLevel { get; set; }
        public string MaxLevel { get; set; }
        public string Mean { get; set; }
        public string StdDevi { get; set; }
        public bool Electrolyte { get; set; }
        public Guid AdminQCLotID { get; set; }
        public AdminQCLot AdminQCLot { get; set; }
    }
}
