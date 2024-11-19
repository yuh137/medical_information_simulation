using AutoMapper;
using Medical_Information.API.Enums;
using Medical_Information.API.Models.Domain;
using Medical_Information.API.Models.DTO;
using Medical_Information.API.Models.ErrorHandling;
using Medical_Information.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Medical_Information.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReagentInputController : ControllerBase
    {
        private readonly IReagentInputRepository inputRepository;
        private readonly IMapper mapper;

        public ReagentInputController(IReagentInputRepository inputRepository, IMapper mapper)
        {
            this.inputRepository = inputRepository;
            this.mapper = mapper;
        }

        [HttpGet]
        [Route("{reportId:Guid}")]
        public async Task<IActionResult> GetRInputsByStudentReport([FromRoute] Guid reportId)
        {
            var reagentInputs = await inputRepository.GetRInputFromStudentReportId(reportId);

            if (reagentInputs == null)
            {
                return NotFound(new RequestErrorObject
                {
                    ErrorCode = ErrorCode.NotFound,
                    Message = "Student Do Not Exist!"
                });
            }

            return Ok(reagentInputs);
        }

        [HttpPost]
        [Route("StudentCreate/{reportId:Guid}")]
        public async Task<IActionResult> CreateRInputsForStudent([FromBody] List<ReagentInputDTO> inputList, [FromRoute] Guid reportId)
        {
            var inputListModel = mapper.Map<List<ReagentInput>>(inputList);

            await inputRepository.CreateReagentInputForStudent(inputListModel, reportId);

            return Ok(inputListModel);
        }
    }
}