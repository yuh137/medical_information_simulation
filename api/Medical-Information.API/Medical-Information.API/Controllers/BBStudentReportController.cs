using AutoMapper;
using Medical_Information.API.Enums;
using Medical_Information.API.Models.Domain;
using Medical_Information.API.Models.DTO;
using Medical_Information.API.Repositories.Interfaces;
using Medical_Information.API.Models.ErrorHandling;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Medical_Information.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BBStudentReportController : ControllerBase
    {
        private readonly IBBStudentReportRepository studentReportRepository;
        private readonly IMapper mapper;

        public BBStudentReportController(IBBStudentReportRepository studentReportRepository, IMapper mapper)
        {
            this.studentReportRepository = studentReportRepository;
            this.mapper = mapper;
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> CreateBBStudentReport([FromBody] List<AddBBStudentReportDTO> dto)
        {
            var newStudentReportModels = mapper.Map<List<BBStudentReport>>(dto);

            var res = await studentReportRepository.CreateBBStudentReportAsync(newStudentReportModels);

            return Ok(res);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBBStudentReport()
        {
            var studentReportModels = await studentReportRepository.GetAllBBStudentReportsAsync();

            var studentReportDTOs = mapper.Map<List<BBStudentReportDTO>>(studentReportModels);

            return Ok(studentReportDTOs);
        }
        [HttpGet]
        [Route("ByStudentId/{studentId:Guid}")]
        public async Task<IActionResult> GetBBReportsByStudentId([FromRoute] Guid studentId)
        {
            var studentReportModels = await studentReportRepository.GetBBStudentReportsByStudentIdAsync(studentId);

            var studentReportDTOs = mapper.Map<List<BBStudentReportDTO>>(studentReportModels);

            return Ok(studentReportDTOs);
        }

        [HttpGet]
        [Route("{id:Guid}")]
        public async Task<IActionResult> GetBBStudentReportById(Guid id)
        {
            var studentReportModel = await studentReportRepository.GetBBStudentReportByIdAsync(id);

            var studentReportDTO = mapper.Map<BBStudentReportDTO>(studentReportModel);

            if (studentReportDTO == null)
            {
                return BadRequest(new
                {
                    ErrorCode = ErrorCode.NotFound,
                    Message = "Student Report Not Found"
                });
            }

            return Ok(studentReportDTO);
        }

        [HttpDelete]
        [Route("{id:Guid}")]
        public async Task<IActionResult> DeleteBBStudentReport([FromRoute] Guid id)
        {
            var reportModel = await studentReportRepository.DeleteBBStudentReportAsync(id);

            if (reportModel == null)
            {
                return NotFound("BB Student Report not found");
            }

            var BBStudentReportDTO = mapper.Map<BBStudentReportDTO>(reportModel);

            return Ok(BBStudentReportDTO);
        }
    }
}