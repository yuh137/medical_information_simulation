using ScrumDumpsterMolecularDiagnostic.Models.Domain;

namespace ScrumDumpsterMolecularDiagnostic.Repositories.Interfaces
{
    public interface IImageRepository
    {
        Task<Images> Upload(Images image);
    }
}
