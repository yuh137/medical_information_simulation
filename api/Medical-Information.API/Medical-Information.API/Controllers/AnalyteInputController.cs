﻿using AutoMapper;
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
    public class AnalyteInputController : ControllerBase
    {
        private readonly IAnalyteInputRepository inputRepository;
        private readonly IMapper mapper;

        public AnalyteInputController(IAnalyteInputRepository inputRepository, IMapper mapper)
        {
            this.inputRepository = inputRepository;
            this.mapper = mapper;
        }

        [HttpGet]
        [Route("{reportId:Guid}")]
        public async Task<IActionResult> GetInputsByStudentReport([FromRoute] Guid reportId)
        {
            var analyteInputs = await inputRepository.GetAllInputFromStudentReportId(reportId);

            if (analyteInputs == null)
            {
                return NotFound(new RequestErrorObject
                {
                    ErrorCode = ErrorCode.NotFound,
                    Message = "Report Does Not Exist!"
                });
            }

            var analyteInputDTOs = mapper.Map<List<AnalyteInputDTO>>(analyteInputs);

            return Ok(analyteInputDTOs);
        }

        [HttpGet]
        [Route("ActiveInputs/{reportId:Guid}")]
        public async Task<IActionResult> GetActiveInputsFromReport([FromRoute] Guid reportId)
        {
            var analyteInputs = await inputRepository.GetActiveInputFromStudentReport(reportId);

            if (analyteInputs == null)
            {
                return NotFound(new RequestErrorObject
                {
                    ErrorCode = ErrorCode.NotFound,
                    Message = "Report Does Not Exist!"
                });
            }

            var analyteInputDTOs = mapper.Map<List<AnalyteInputDTO>>(analyteInputs);

            return Ok(analyteInputDTOs);
        }

        [HttpPost]
        [Route("Create/{reportId:Guid}")]
        public async Task<IActionResult> CreateInputsForStudent([FromBody] List<AnalyteInputDTO> inputList, [FromRoute] Guid reportId)
        {
            var inputListModel = mapper.Map<List<AnalyteInput>>(inputList);

            await inputRepository.UpdateOrCreateAnalyteInput(inputListModel, reportId);

            return Ok(inputListModel);
        }
    }
}
