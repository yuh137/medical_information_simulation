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
    public class AdminAnalyteReportController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly IAdminAnalyteReportRepository reportRepository;

        public AdminAnalyteReportController(IMapper mapper, IAdminAnalyteReportRepository reportRepository)
        {
            this.mapper = mapper;
            this.reportRepository = reportRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAnalyteReports()
        {
            var reportModels = await reportRepository.GetAllAdminReportsAsync();

            var reportDTOs = mapper.Map<List<AdminAnalyteReportDTO>>(reportModels);

            return Ok(reportDTOs);
        }

        [HttpGet]
        [Route("{id:Guid}")]
        public async Task<IActionResult> GetAnalyteReportById([FromRoute] Guid id)
        {
            var reportModel = await reportRepository.GetAdminReportByIdAsync(id);

            var reportDTO = mapper.Map<AdminAnalyteReportDTO>(reportModel);

            return Ok(reportDTO);
        }

        [HttpGet]
        [Route("ByAdminId/{adminId:Guid}")]
        public async Task<IActionResult> GetAnalyteReportsByAdminId([FromRoute] Guid adminId)
        {
            var reportModels = await reportRepository.GetAdminReportsByAdminIdAsync(adminId);

            var reportDTOs = mapper.Map<List<AdminAnalyteReportDTO>>(reportModels);

            return Ok(reportDTOs);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> CreateAdminAnalyteReport([FromBody] List<AddAdminReportDTO> dto)
        {
            var reportModels = mapper.Map<List<AdminAnalyteReport>>(dto);

            var res = await reportRepository.CreateAdminReportAsync(reportModels);

            return Ok(res);
        }
    }
}
