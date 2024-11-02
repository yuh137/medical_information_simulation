using Medical_Information.API.Enums;

namespace Medical_Information.API.Models.ErrorHandling
{
    public class RequestErrorObject
    {
        public ErrorCode ErrorCode { get; set; }
        public string? Message { get; set; }
    }
}
