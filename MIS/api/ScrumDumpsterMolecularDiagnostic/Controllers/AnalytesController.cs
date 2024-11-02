using AutoMapper;
using ScrumDumpsterMolecularDiagnostic.Models.Domain;
using ScrumDumpsterMolecularDiagnostic.Models.DTO;
using ScrumDumpsterMolecularDiagnostic.Repositories.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ScrumDumpsterMolecularDiagnostic.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnalytesController : ControllerBase
    {
        private readonly IAnalyteRepository analyteRepository;
        private readonly IMapper mapper;

        public AnalytesController(IAnalyteRepository analyteRepository, IMapper mapper)
        {
            this.analyteRepository = analyteRepository;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAnalytes()
        {
            var analyteModel = await analyteRepository.GetAllAnalytesAsync();

            var analyteDTO = mapper.Map<List<Analyte>>(analyteModel);

            return Ok(analyteDTO);
        }

        [HttpPost]
        [Route("{lotId:Guid}")]
        public async Task<IActionResult> CreateAnalyte([FromRoute] Guid lotId, [FromBody] AddAnalyteRequestDTO dto)
        {
            var analyteModel = mapper.Map<Analyte>(dto);

            await analyteRepository.CreateAnalyteAsync(analyteModel);

            var analyteDTO = mapper.Map<AnalyteDTO>(analyteModel);

            return CreatedAtAction("Get", new { id = analyteDTO.AnalyteID }, analyteDTO);
        }

        [HttpGet]
        [Route("{lotId:Guid}")]
        public async Task<IActionResult> GetAllAnalytesFromQCLot([FromRoute] Guid lotId)
        {
            var analyteModels = await analyteRepository.GetAllAnalytesFromQCLotAsync(lotId);

            var analyteDTO = mapper.Map<List<AnalyteDTO>>(analyteModels);

            return Ok(analyteDTO);
        }
    }
}
