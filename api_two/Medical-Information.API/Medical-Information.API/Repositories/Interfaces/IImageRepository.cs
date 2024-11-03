using Medical_Information.API.Models.Domain;

namespace Medical_Information.API.Repositories.Interfaces
{
    public interface IImageRepository
    {
        Task<Images> Upload(Images image);
    }
}
