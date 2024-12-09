namespace Medical_Information.API.Models.DTO
{
    public class AddAdminReportDTO
    {
        public Guid AdminID { get; set; }
        public Guid AdminQCLotID { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
