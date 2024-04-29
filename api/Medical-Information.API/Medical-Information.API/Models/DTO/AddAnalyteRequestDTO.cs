namespace Medical_Information.API.Models.DTO
{
    public class AddAnalyteRequestDTO
    {
        public string AnalyteName { get; set; }
        public string AnalyteAcronym { get; set; }
        public string UnitOfMeasure { get; set; }
        public float MinLevel { get; set; }
        public float MaxLevel { get; set; }
        public float Mean { get; set; }
        public float StdDevi { get; set; }
        public bool Electrolyte { get; set; }
        public Guid AdminQCLotID { get; set; }
    }
}
