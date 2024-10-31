using ScrumDumpsterMolecularDiagnostic.Models.Domain;
using ScrumDumpsterMolecularDiagnostic.Models.DTO;
using ScrumDumpsterMolecularDiagnostic.Repositories.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ScrumDumpsterMolecularDiagnostic.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        private readonly IImageRepository imageRepository;

        public ImagesController(IImageRepository imageRepository)
        {
            this.imageRepository = imageRepository;
        }
        [HttpPost]
        [Route("Upload")]
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

                await imageRepository.Upload(imageDomainModel);

                return Ok(imageDomainModel);
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
