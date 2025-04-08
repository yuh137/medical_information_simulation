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
        [Route("ByAdminId/{adminId:Guid}")]
        public async Task<IActionResult> GetReportsByAdminId([FromRoute] Guid adminId)
        {
            var studentReportsModels = await studentReportRepository.GetStudentReportsByAdminIdAsync(adminId);

            var studentReportDTOs = mapper.Map<List<StudentReportDTO>>(studentReportsModels);

            return Ok(studentReportDTOs);
        }

        [HttpGet]
        [Route("{id:Guid}")]
        public async Task<IActionResult> GetStudentReportById([FromRoute] Guid id)
        {
            var studentReportModel = await studentReportRepository.GetStudentReportByIdAsync(id);

            if (studentReportModel == null)
            {
                return BadRequest(new {
                    ErrorCode = ErrorCode.NotFound,
                    Message = "Student Report Not Found"
                });
            }

            var studentReportDTO = mapper.Map<StudentReportDTO>(studentReportModel);

            return Ok(studentReportDTO);
        }

        [HttpPut]
        [Route("ResultQC/{reportId:Guid}")]
        public async Task<IActionResult> ResultCurrentReport([FromRoute] Guid reportId)
        {
            var studentReportModel = await studentReportRepository.ResultCurrentReport(reportId);

            if (studentReportModel == null)
            {
                return BadRequest(new
                {
                    ErrorCode = ErrorCode.NotFound,
                    Message = "Student Report Not Found"
                });
            }

            var studentReportDTO = mapper.Map<StudentReportDTO>(studentReportModel);

            return Ok(studentReportDTO);
        }

        [HttpGet]
        [Route("GetUnfilledByAdminId/{adminId:Guid}")]
        public async Task<IActionResult> GetUnFilledReportsByAdminId([FromRoute] Guid adminId)
        {
            var studentReportModels = await studentReportRepository.GetUnFilledReportsByAdminId(adminId);

            var studentReportDTOs = mapper.Map<List<StudentReportDTO>>(studentReportModels);

            return Ok(studentReportDTOs);
        }

        [HttpGet]
        [Route("GetUnfilledByStudentId/{studentId:Guid}")]
        public async Task<IActionResult> GetUnFilledReportsByStudentId([FromRoute] Guid studentId)
        {
            var studentReportModels = await studentReportRepository.GetUnFilledReportsByStudentId(studentId);

            var studentReportDTOs = mapper.Map<List<StudentReportDTO>>(studentReportModels);

            return Ok(studentReportDTOs);
        }

        [HttpDelete]
        [Route("Delete/{reportId:Guid}")]
        public async Task<IActionResult> DeleteStudentReportById([FromRoute] Guid reportId)
        {
            var studentReportModel = await studentReportRepository.DeleteStudentReportByID(reportId);

            if (studentReportModel == null)
            {
                return BadRequest(new
                {
                    ErrorCode = ErrorCode.NotFound,
                    Message = "Student Report Not Found"
                });
            }

            var studentReportDTO = mapper.Map<StudentReportDTO>(studentReportModel);

            return Ok(studentReportDTO);
        }
    }
}
