using AutoMapper;
using Medical_Information.API.Enums;
using Medical_Information.API.Models.Domain;
using Medical_Information.API.Models.DTO;
using Medical_Information.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Medical_Information.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentReportController : ControllerBase
    {
        private readonly IStudentReportRepository studentReportRepository;
        private readonly IMapper mapper;

        public StudentReportController(IStudentReportRepository studentReportRepository, IMapper mapper)
        {
            this.studentReportRepository = studentReportRepository;
            this.mapper = mapper;
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> CreateStudentReport([FromBody] List<AddStudentReportDTO> dto) 
        {
            var newStudentReportModels = mapper.Map<List<StudentReport>>(dto);

            var res = await studentReportRepository.CreateStudentReportAsync(newStudentReportModels);

            return Ok(res);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllStudentReport()
        {
            var studentReportModels = await studentReportRepository.GetAllStudentReportsAsync();

            var studentReportDTOs = mapper.Map<List<StudentReportDTO>>(studentReportModels);

            return Ok(studentReportDTOs);
        }
        [HttpGet]
        [Route("ByStudentId/{studentId:Guid}")]
        public async Task<IActionResult> GetReportsByStudentId([FromRoute] Guid studentId)
        {
            var studentReportModels = await studentReportRepository.GetStudentReportsByStudentIdAsync(studentId);

            var studentReportDTOs = mapper.Map<List<StudentReportDTO>>(studentReportModels);

            return Ok(studentReportDTOs);
        }

        [HttpGet]
        [Route("{id:Guid}")]
        public async Task<IActionResult> GetStudentReportById(Guid id)
        {
            var studentReportModel = await studentReportRepository.GetStudentReportByIdAsync(id);

            var studentReportDTO = mapper.Map<StudentReportDTO>(studentReportModel);

            if (studentReportDTO == null)
            {
                return BadRequest(new {
                    ErrorCode = ErrorCode.NotFound,
                    Message = "Student Report Not Found"
                });
            }

            return Ok(studentReportDTO);
        }
    }
}
