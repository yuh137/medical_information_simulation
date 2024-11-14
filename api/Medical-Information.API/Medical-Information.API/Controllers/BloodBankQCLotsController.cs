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
    public class BloodBankQCLotsController : ControllerBase
    {
        private readonly IBloodBankQCLotRepository bloodBankQCLotRepository;
        private readonly IMapper mapper;
        private readonly IReagentRepository reagentRepository;


        // public BloodBankQCLotsController(IBloodBankQCLotRepository bloodBankQCLotRepository, IMapper mapper, IAnalyteRepository analyteRepository)
        public BloodBankQCLotsController(IBloodBankQCLotRepository bloodBankQCLotRepository, IMapper mapper, IReagentRepository reagentRepository)
        {
            this.bloodBankQCLotRepository = bloodBankQCLotRepository;
            this.mapper = mapper;
            this.reagentRepository = reagentRepository;
        }

        [HttpGet]
        [Route("ByNameList")]
        public async Task<IActionResult> GetBBQCLotsByNameList([FromQuery] List<string> names)
        {
            var qclotModels = await bloodBankQCLotRepository.GetBBQCLotsByNameListAsync(names);

            var qclotDTOs = mapper.Map<List<BloodBankQCLotDTO>>(qclotModels);

            return Ok(qclotDTOs);
        }

        [HttpGet]
        [Route("ByIdList")]
        public async Task<IActionResult> GetBBQCLotsByIdList([FromQuery] List<Guid> lotId)
        {
            var qclotModels = await bloodBankQCLotRepository.GetBBQCLotsByIdListAsync(lotId);

            var qclotDTOs = mapper.Map<List<BloodBankQCLotDTO>>(qclotModels);

            return Ok(qclotDTOs);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBBQCLots()
        {
            var qcLotsModels = await bloodBankQCLotRepository.GetAllBBQCLotsAsync();

            var qcLotsDTO = mapper.Map<List<BloodBankQCLotDTO>>(qcLotsModels);

            return Ok(qcLotsDTO);
        }

        [HttpGet]
        [Route("{id:Guid}")]
        public async Task<IActionResult> GetQCLotById([FromRoute] Guid id)
        {
            var qcLotModel = await bloodBankQCLotRepository.GetBBQCLotByIDAsync(id);

            var qcLotDTO = mapper.Map<BloodBankQCLotDTO>(qcLotModel);

            return Ok(qcLotDTO);
        }

        [HttpPost]
        public async Task<IActionResult> CreateBBQCLot([FromBody] AddBloodBankQCLotRequestDTO dto)
        {
            //var qclotModel = mapper.Map<AdminQCLot>(dto);
            var qclotModel = new BloodBankQCLot
            {
                QCName = dto.QCName,
                LotNumber = dto.LotNumber,
                OpenDate = dto.OpenDate,
                ClosedDate = dto.ClosedDate,
                ExpirationDate = dto.ExpirationDate,
                FileDate = dto.FileDate,
                Reagents = new List<Reagent>(),
                Reports = new List<BBStudentReport>()
            };

         
            foreach (var reagentDTO in dto.Reagents)
            {
                if (reagentDTO != null)
                {
                    var reagentModel = mapper.Map<Reagent>(reagentDTO);

                    qclotModel.Reagents.Add(reagentModel);
                }
            }
            

await bloodBankQCLotRepository.CreateBBQCLotAsync(qclotModel);

var qclotDTO = mapper.Map<BloodBankQCLotDTO>(qclotModel);

//return CreatedAtAction("Get", new { id = qclotDTO.AdminQCLotID }, qclotDTO);
return Ok(qclotDTO);
        }
    }
}
