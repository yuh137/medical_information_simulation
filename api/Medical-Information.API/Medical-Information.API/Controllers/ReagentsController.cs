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
    public class ReagentsController : ControllerBase
    {
        private readonly IReagentRepository reagentRepository;
        private readonly IMapper mapper;

        public ReagentsController(IReagentRepository reagentRepository, IMapper mapper)
        {
            this.reagentRepository = reagentRepository;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllReagents()
        {
            var reagentModel = await reagentRepository.GetAllReagentsAsync();

            var reagentDTO = mapper.Map<List<Reagent>>(reagentModel);

            return Ok(reagentDTO);
        }

        [HttpPost]
        [Route("{lotId:Guid}")]
        public async Task<IActionResult> CreateReagent([FromRoute] Guid lotId, [FromBody] AddReagentRequestDTO dto)
        {
            var reagentModel = mapper.Map<Reagent>(dto);

            await reagentRepository.CreateReagentAsync(reagentModel);

            var reagentDTO = mapper.Map<ReagentDTO>(reagentModel);

            return CreatedAtAction("Get", new { id = reagentDTO.ReagentID }, reagentDTO);
        }

        [HttpGet]
        [Route("{lotId:Guid}")]
        public async Task<IActionResult> GetAllReagentsFromQCLot([FromRoute] Guid lotId)
        {
            var reagentModels = await reagentRepository.GetAllReagentsFromQCLotAsync(lotId);

            var reagentDTO = mapper.Map<ReagentDTO>(reagentModels);

            return Ok(reagentDTO);
        }
    }
}
