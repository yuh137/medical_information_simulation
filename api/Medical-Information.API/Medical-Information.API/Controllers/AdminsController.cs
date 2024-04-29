using AutoMapper;
using Medical_Information.API.Data;
using Medical_Information.API.Models.Domain;
using Medical_Information.API.Models.DTO;
using Medical_Information.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Medical_Information.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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
        public async Task<IActionResult> GetAllAdmins()
        {
            var adminsDomain = await adminRepository.GetAdminAsync();

            //var adminsDTO = new List<AdminDTO>();
            //foreach (var admin in adminsDomain)
            //{
            //    adminsDTO.Add(new AdminDTO()
            //    {
            //        AdminID = admin.AdminID,
            //        Username = admin.Username,
            //        Password = admin.Password,
            //    });
            //}

            var adminsDTO = mapper.Map<List<AdminDTO>>(adminsDomain);

            return Ok(adminsDTO);
        }

        [HttpGet]
        [Route("{id:Guid}")]
        public async Task<IActionResult> GetAdminById([FromRoute] Guid id)
        {
            //var admin = dbContext.Admins.Find(id);
            var adminDomain = await adminRepository.GetAdminByIdAsync(id);

            if (adminDomain == null)
            {
                return NotFound();
            }

            //var adminDTO = new AdminDTO()
            //{
            //    AdminID = adminDomain.AdminID,
            //    Username = adminDomain.Username,
            //    Password = adminDomain.Password,
            //};

            var adminDTO = mapper.Map<AdminDTO>(adminDomain);

            return Ok(adminDTO);
        }

        [HttpPost]
        public async Task<IActionResult> CreateNewAdmin([FromBody] AddAdminRequestDTO request)
        {
            //var newAdmin = new Admin()
            //{
            //    Username = request.Username,
            //    Password = request.Password,
            //};
            var newAdmin = mapper.Map<Admin>(request);

            await adminRepository.CreateAdminAsync(newAdmin);

            //var adminDTO = new AdminDTO
            //{
            //    Username = newAdmin.Username,
            //    Password = newAdmin.Password,
            //};
            var adminDTO = mapper.Map<AdminDTO>(newAdmin);

            return CreatedAtAction(nameof(GetAdminById), new { id = adminDTO.AdminID }, adminDTO);
        }

        [HttpPut]
        [Route("{id:Guid}")]
        public async Task<IActionResult> UpdateAdmin([FromRoute] Guid id, [FromBody] UpdatePasswordDTO updatePasswordDTO)
        {
            var adminDomain = await adminRepository.UpdateAdminPasswordAsync(id, updatePasswordDTO);

            if (adminDomain == null)
            {
                return NotFound("Admin not found");
            }

            //adminDomain.Password = updatePasswordDTO.Password;
            //await dbContext.SaveChangesAsync();

            //var adminDTO = new AdminDTO
            //{
            //    Username = adminDomain.Username,
            //    Password = adminDomain.Password
            //};
            var adminDTO = mapper.Map<AdminDTO>(adminDomain);

            return Ok(adminDTO);
        }

        [HttpDelete]
        [Route("{id:Guid}")]
        public async Task<IActionResult> DeleteAdmin([FromRoute] Guid id)
        {
            var adminModel = await adminRepository.DeleteAdminAsync(id);

            if (adminModel == null)
            {
                return NotFound("Admin does not exist");
            }

            //dbContext.Admins.Remove(adminModel);
            //await dbContext.SaveChangesAsync();

            //var adminDTO = new AdminDTO
            //{
            //    Username = adminModel.Username,
            //    Password = adminModel.Password,
            //};
            var adminDTO = mapper.Map<AdminDTO>(adminModel);

            return Ok(adminDTO);
        }
    }
}
