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
        // private readonly IAnalyteRepository analyteRepository;


        // public BloodBankQCLotsController(IBloodBankQCLotRepository bloodBankQCLotRepository, IMapper mapper, IAnalyteRepository analyteRepository)
        public BloodBankQCLotsController(IBloodBankQCLotRepository bloodBankQCLotRepository, IMapper mapper)
        {
            this.bloodBankQCLotRepository = bloodBankQCLotRepository;
            this.mapper = mapper;
            // this.analyteRepository = analyteRepository;
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
                // Analytes = new List<Analyte>(),
                Reports = new List<StudentReport>()
            };

            // REPLACE WITH REAGENTS
            /*
            foreach (var analyteDTO in dto.Analytes)
            {
                if (analyteDTO != null)
                {
                    var analyteModel = mapper.Map<Analyte>(analyteDTO);

                    // qclotModel.Analytes.Add(analyteModel);
                }
            }
            */

await bloodBankQCLotRepository.CreateBBQCLotAsync(qclotModel);

var qclotDTO = mapper.Map<BloodBankQCLotDTO>(qclotModel);

//return CreatedAtAction("Get", new { id = qclotDTO.AdminQCLotID }, qclotDTO);
return Ok(qclotDTO);
        }
    }
}
