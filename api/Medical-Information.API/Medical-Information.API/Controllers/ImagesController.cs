using Medical_Information.API.Models.Domain;
using Medical_Information.API.Models.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Medical_Information.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        public async Task<IActionResult> Upload([FromForm] ImageUploadRequestDTO requestDTO)
        {
            ValidateFileUpload(requestDTO);

            if (ModelState.IsValid)
            {
                var imageDomainModel = new Images
                {
                    File = requestDTO.File,
                    FileDescription = requestDTO.FileDescription,
                    FileName = requestDTO.FileName,
                    FileSizeInBytes = requestDTO.File.Length,
                    FileExtension = Path.GetExtension(requestDTO.File.FileName)
                };
            }

            return BadRequest(ModelState);
        }

        private void ValidateFileUpload(ImageUploadRequestDTO requestDTO)
        {
            var allowedExtension = new string[] { ".jpg", ".jpeg", ".png" };

            if (allowedExtension.Contains(Path.GetExtension(requestDTO.File.FileName)))
            {
                ModelState.AddModelError("file", "Unsupported file extension");
            }

            if (requestDTO.File.Length > 10485760)
            {
                ModelState.AddModelError("file", "File size more than 10MB");
            }
        }
    }
}
