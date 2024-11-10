using AutoMapper;
using Medical_Information.API.Enums;
using Medical_Information.API.Models.Domain;
using Medical_Information.API.Models.DTO;
using Medical_Information.API.Models.ErrorHandling;
using Medical_Information.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Azure.Core.HttpHeader;

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
        [HttpGet]
        [Route("ByNameList")]
        public async Task<IActionResult> GetQCLotByNameList([FromQuery] List<string> names)
        {
            var qclotModels = await adminQCLotRepository.GetAdminQCLotsByNameListAsync(names);

            var qclotDTOs = mapper.Map<List<AdminQCLotDTO>>(qclotModels);

            return Ok(qclotDTOs);
        }

        [HttpGet]
        [Route("ByIdList")]
        public async Task<IActionResult> GetQCLotByIdList([FromQuery] List<Guid> lotId)
        {
            var qclotModels = await adminQCLotRepository.GetAdminQCLotsByIdListAsync(lotId);

            var qclotDTOs = mapper.Map<List<AdminQCLotDTO>>(qclotModels);

            return Ok(qclotDTOs);
        }

        [HttpGet]
        [Route("ByName")]
        public async Task<IActionResult> GetQCLotByName([FromQuery] string? name, [FromQuery] string? dep)
        {
            AdminQCLot? qcLotModel;

            if (Enum.TryParse(dep, true, out Department department))
            {
                qcLotModel = await adminQCLotRepository.GetAdminQCLotByNameAsync(name, department);
            } else
            {
                qcLotModel = await adminQCLotRepository.GetAdminQCLotByNameAsync(name);
            }

            if (qcLotModel == null)
            {
                return NotFound(new RequestErrorObject
                {
                    ErrorCode = ErrorCode.NotFound,
                    Message = "QC Lot Do Not Exist!"
                });
            }

            var qcLotDTO = mapper.Map<AdminQCLotDTO>(qcLotModel);

            return Ok(qcLotDTO);
        }

        [HttpPost]
        public async Task<IActionResult> CreateQCLot([FromBody] AddAdminQCLotRequestDTO dto)
        {
            var qclotModel = new AdminQCLot
            {
                QCName = dto.QCName,
                LotNumber = dto.LotNumber,
                OpenDate = dto.OpenDate,
                ClosedDate = dto.ClosedDate,
                ExpirationDate = dto.ExpirationDate,
                IsActive = true,
                FileDate = dto.FileDate,
                Department = dto.Department,
                Analytes = new List<Analyte>(),
                Reports = new List<StudentReport>()
            };

            var checkExistingModel = await adminQCLotRepository.DoesLotNumberExist(qclotModel);

            if (checkExistingModel != null)
            {
                 return BadRequest(new RequestErrorObject
                 {
                     ErrorCode = ErrorCode.AlreadyExist,
                     Message = "Lot Number Already Exist!",
                 });
            }

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

        [HttpPut]
        [Route("UpdateQCLot/{id:Guid}")]
        public async Task<IActionResult> UpdateQCLot([FromRoute] Guid id, [FromBody] UpdateAdminQCLotDTO dto)
        {

            var qclotModel = mapper.Map<AdminQCLot>(dto);

            qclotModel = await adminQCLotRepository.UpdateQCLotAsync(id, qclotModel);

            if (qclotModel == null)
            {
                return BadRequest(new RequestErrorObject
                {
                    ErrorCode = ErrorCode.NotFound,
                });
            }

            return Ok(qclotModel);
        }
    }
}
