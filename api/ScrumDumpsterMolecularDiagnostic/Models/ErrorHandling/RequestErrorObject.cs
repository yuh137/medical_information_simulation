using ScrumDumpsterMolecularDiagnostic.Enums;

namespace ScrumDumpsterMolecularDiagnostic.Models.ErrorHandling
{
    public class RequestErrorObject
    {
        public ErrorCode ErrorCode { get; set; }
        public string? Message { get; set; }
    }
}
