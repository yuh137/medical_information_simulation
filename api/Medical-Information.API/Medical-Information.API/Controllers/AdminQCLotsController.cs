using AutoMapper;
using Medical_Information.API.Models.Domain;
using Medical_Information.API.Models.DTO;
using Medical_Information.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Medical_Information.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminQCLotsController : ControllerBase
    {
        private readonly IAdminQCLotRepository adminQCLotRepository;
        private readonly IMapper mapper;

        public AdminQCLotsController(IAdminQCLotRepository adminQCLotRepository, IMapper mapper)
        {
            this.adminQCLotRepository = adminQCLotRepository;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllQCLots()
        {
            var qcLotsModels = await adminQCLotRepository.GetAllQCLotsAsync();

            var qcLotsDTO = mapper.Map<List<AdminQCLotDTO>>(qcLotsModels);

            return Ok(qcLotsDTO);
        }

        [HttpPost]
        public async Task<IActionResult> CreateQCLot([FromBody] AddAdminQCLotRequestDTO dto)
        {
            var qclotModel = mapper.Map<AdminQCLot>(dto);

            await adminQCLotRepository.CreateQCLotAsync(qclotModel);

            var qclotDTO = mapper.Map<AdminQCLotDTO>(qclotModel);

            return CreatedAtAction("Get", new { id = qclotDTO.AdminQCLotID }, qclotDTO);
        }
    }
}
