using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medical_Information.API.Models.Domain
{
    public class AntiSera
    {
        [Key]
        public Guid AntiSeraID { get; set; }
        public string AntiSeraName { get; set; }
        public string Abbreviation { get; set; }
        public string ImmediateSpinRange { get; set; }
        public string DegreeRange { get; set; }
        public string AHQRange { get; set; }
        public string CheckCellsRange { get; set; }
        [ForeignKey("AdminQCLotID")]
        public Guid AdminQCLotID { get; set; }
        //public AdminQCLot AdminQCLot { get; set; }
    }
}
