namespace Medical_Information.API.Models.DTO
{
    public class SetIsOrderableDTO
    {
        public Guid TemplateId { get; set; }
        public bool IsOrderable { get; set; }
    }
}
