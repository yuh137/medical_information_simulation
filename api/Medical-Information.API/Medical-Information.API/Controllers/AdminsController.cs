using Medical_Information.API.Data;
using Medical_Information.API.Models.Domain;
using Medical_Information.API.Models.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Medical_Information.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminsController : ControllerBase
    {
        private readonly MedicalInformationDbContext dbContext;

        public AdminsController(MedicalInformationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public IActionResult GetAllAdmins()
        {
            var adminsDomain = dbContext.Admins.ToList();

            var adminsDTO = new List<AdminDTO>();
            foreach (var admin in adminsDomain)
            {
                adminsDTO.Add(new AdminDTO()
                {
                    AdminID = admin.AdminID,
                    Username = admin.Username,
                    Password = admin.Password,
                });
            }

            return Ok(adminsDTO);
        }

        [HttpGet]
        [Route("{id:Guid}")]
        public IActionResult GetAdminById([FromRoute] Guid id)
        {
            //var admin = dbContext.Admins.Find(id);
            var adminDomain = dbContext.Admins.FirstOrDefault(x => x.AdminID == id);

            if (adminDomain == null)
            {
                return NotFound();
            }

            var adminDTO = new AdminDTO()
            {
                AdminID = adminDomain.AdminID,
                Username = adminDomain.Username,
                Password = adminDomain.Password,
            };

            return Ok(adminDTO);
        }

        [HttpPost]
        public IActionResult CreateNewAdmin([FromBody] AddAdminRequest request)
        {
            var newAdmin = new Admin()
            {
                AdminID = new Guid(),
                Username = request.Username,
                Password = request.Password,
            };

            dbContext.Admins.Add(newAdmin);
            dbContext.SaveChanges();

            var adminDTO = new AdminDTO
            {
                Username = newAdmin.Username,
                Password = newAdmin.Password,
            };

            return CreatedAtAction(nameof(GetAdminById), new { id = adminDTO.AdminID }, adminDTO);
        }

        [HttpPut]
        [Route("{id:Guid}")]
        public IActionResult UpdateAdmin([FromRoute] Guid id, [FromBody] UpdatePasswordDTO updatePasswordDTO)
        {
            var adminDomain = dbContext.Admins.Find(id);

            if (adminDomain == null)
            {
                return NotFound("Admin not found");
            }

            adminDomain.Password = updatePasswordDTO.Password;
            dbContext.SaveChanges();

            var adminDTO = new AdminDTO
            {
                Username = adminDomain.Username,
                Password = adminDomain.Password
            };

            return Ok(adminDTO);
        }
    }
}
