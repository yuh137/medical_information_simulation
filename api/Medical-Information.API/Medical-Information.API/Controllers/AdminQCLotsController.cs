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
        private readonly IAnalyteRepository analyteRepository;

        public AdminQCLotsController(IAdminQCLotRepository adminQCLotRepository, IMapper mapper, IAnalyteRepository analyteRepository)
        {
            this.adminQCLotRepository = adminQCLotRepository;
            this.mapper = mapper;
            this.analyteRepository = analyteRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllQCLots()
        {
            var qcLotsModels = await adminQCLotRepository.GetAllQCLotsAsync();

            var qcLotsDTO = mapper.Map<List<AdminQCLotDTO>>(qcLotsModels);

            return Ok(qcLotsDTO);
        }

        [HttpGet]
        [Route("{id:Guid}")]
        public async Task<IActionResult> GetQCLotById([FromRoute] Guid id)
        {
            var qcLotModel = await adminQCLotRepository.GetQCLotByIDAsync(id);

            var qcLotDTO = mapper.Map<AdminQCLotDTO>(qcLotModel);

            return Ok(qcLotDTO);
        }

        [HttpPost]
        public async Task<IActionResult> CreateQCLot([FromBody] AddAdminQCLotRequestDTO dto)
        {
            //var qclotModel = mapper.Map<AdminQCLot>(dto);
            var qclotModel = new AdminQCLot
            {
                QCName = dto.QCName,
                LotNumber = dto.LotNumber,
                OpenDate = dto.OpenDate,
                ClosedDate = dto.ClosedDate,
                ExpirationDate = dto.ExpirationDate,
                FileDate = dto.FileDate,
                Department = dto.Department,
                Analytes = new List<Analyte>(),
                Reports = new List<StudentReport>()
            };

            foreach (var analyteDTO in dto.Analytes)
            {
                if (analyteDTO != null)
                {
                    var analyteModel = mapper.Map<Analyte>(analyteDTO);

                    qclotModel.Analytes.Add(analyteModel);
                }
            }

            await adminQCLotRepository.CreateQCLotAsync(qclotModel);

            var qclotDTO = mapper.Map<AdminQCLotDTO>(qclotModel);

            //return CreatedAtAction("Get", new { id = qclotDTO.AdminQCLotID }, qclotDTO);
            return Ok(qclotDTO);
        }
    }
}
