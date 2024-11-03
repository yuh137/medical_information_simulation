using AutoMapper;
using Medical_Information.API.CustomActionFilter;
using Medical_Information.API.Models.Domain;
using Medical_Information.API.Models.DTO;
using Medical_Information.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medical_Information.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class AdminsController : ControllerBase
    {
        private readonly IAdminRepository adminRepository;
        private readonly IMapper mapper;

        public AdminsController(IAdminRepository adminRepository, IMapper mapper)
        {
            this.adminRepository = adminRepository;
            this.mapper = mapper;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllAdmins([FromQuery] string? filterQuery)
        {
            var adminsDomain = await adminRepository.GetAdminAsync(filterQuery);

            var adminsDTO = mapper.Map<List<AdminDTO>>(adminsDomain);

            return Ok(adminsDTO);
        }

        [HttpGet]
        [Route("{id:Guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAdminById([FromRoute] Guid id)
        {
            var adminDomain = await adminRepository.GetAdminByIdAsync(id);

            if (adminDomain == null)
            {
                return NotFound();
            }

            var adminDTO = mapper.Map<AdminDTO>(adminDomain);

            return Ok(adminDTO);
        }

        //[HttpPost]
        //[ValidateModel]
        //public async Task<IActionResult> CreateNewAdmin([FromBody] AddAdminRequestDTO request)
        //{
        //    var newAdmin = mapper.Map<Admin>(request);

        //    await adminRepository.CreateAdminAsync(newAdmin);

        //    var adminDTO = mapper.Map<AdminDTO>(newAdmin);

        //    return CreatedAtAction(nameof(GetAdminById), new { id = adminDTO.AdminID }, adminDTO);
        //}

        //[HttpPut]
        //[Route("{id:Guid}")]
        //[Authorize(Roles = "Admin")]
        //public async Task<IActionResult> UpdateAdmin([FromRoute] Guid id, [FromBody] UpdatePasswordDTO updatePasswordDTO)
        //{
        //    var adminDomain = await adminRepository.UpdateAdminPasswordAsync(id, updatePasswordDTO);

        //    if (adminDomain == null)
        //    {
        //        return NotFound("Admin not found");
        //    }

        //    var adminDTO = mapper.Map<AdminDTO>(adminDomain);

        //    return Ok(adminDTO);
        //}

        [HttpDelete]
        [Route("{id:Guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAdmin([FromRoute] Guid id)
        {
            var adminModel = await adminRepository.DeleteAdminAsync(id);

            if (adminModel == null)
            {
                return NotFound("Admin does not exist");
            }

            var adminDTO = mapper.Map<AdminDTO>(adminModel);

            return Ok(adminDTO);
        }
    }
}
