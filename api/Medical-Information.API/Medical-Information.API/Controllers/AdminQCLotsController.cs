using AutoMapper;
using Medical_Information.API.Enums;
using Medical_Information.API.Models.Domain;
using Medical_Information.API.Models.DTO;
using Medical_Information.API.Models.ErrorHandling;
using Medical_Information.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Medical_Information.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminQCLotsController : ControllerBase
    {
        private readonly IAdminQCLotRepository adminQCLotRepository;
        private readonly IMapper mapper;
        private readonly IAnalyteRepository analyteRepository;

        public AdminQCLotsController(IAdminQCLotRepository adminQCLotRepository, IMapper mapper, IAnalyteRepository analyteRepository)
        {
            this.adminQCLotRepository = adminQCLotRepository;
            this.mapper = mapper;
            this.analyteRepository = analyteRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllQCLots()
        {
            var qcLotsModels = await adminQCLotRepository.GetAllQCLots();

            var qcLotsDTO = mapper.Map<List<AdminQCLotDTO>>(qcLotsModels);

            return Ok(qcLotsDTO);
        }

        [HttpGet]
        [Route("GetAllTemplates")]
        public async Task<IActionResult> GetAllTemplates()
        {
            var qcTemplateModels = await adminQCLotRepository.GetAllQCTemplates();

            var qcTemplateDTOs = mapper.Map<List<AdminQCTemplateDTO>>(qcTemplateModels);

            return Ok(qcTemplateDTOs);
        }

        [HttpGet]
        [Route("{id:Guid}")]
        public async Task<IActionResult> GetQCLotById([FromRoute] Guid id)
        {
            var qcLotModel = await adminQCLotRepository.GetQCLotByID(id);

            var qcLotDTO = mapper.Map<AdminQCLotDTO>(qcLotModel);

            return Ok(qcLotDTO);
        }
        [HttpGet]
        [Route("ByNameList")]
        public async Task<IActionResult> GetQCLotByNameList([FromQuery] List<string> names)
        {
            var qclotModels = await adminQCLotRepository.GetAdminQCLotsByNameList(names);

            var qclotDTOs = mapper.Map<List<AdminQCLotDTO>>(qclotModels);

            return Ok(qclotDTOs);
        }

        [HttpGet]
        [Route("GetAllCustomLots")]
        public async Task<IActionResult> GetAllCustomQCLots()
        {
            var qcLotModels = await adminQCLotRepository.GetAllCustomQCLots();

            var qcLotDTOs = mapper.Map<List<AdminQCLotDTO>>(qcLotModels);

            return Ok(qcLotDTOs);
        }

        [HttpGet]
        [Route("GetAllCustomTemplates")]
        public async Task<IActionResult> GetAllCustomTemplates()
        {
            var qcTemplateModels = await adminQCLotRepository.GetAllCustomTemplates();

            var qcTemplateDTOs = mapper.Map<List<AdminQCTemplateDTO>>(qcTemplateModels);

            return Ok(qcTemplateDTOs);
        }

        [HttpGet]
        [Route("HistoryByName")]
        public async Task<IActionResult> GetQCLotsHistoryByName([FromQuery] string? name, [FromQuery] string? dep)
        {
            List<AdminQCLot> qcLotModels = new List<AdminQCLot>();

            if (Enum.TryParse(dep, true, out Department department))
            {
                qcLotModels = await adminQCLotRepository.GetQCLotsHistoryByName(name, department);
            }
            else
            {
                qcLotModels = await adminQCLotRepository.GetQCLotsHistoryByName(name);
            }

            if (qcLotModels == null)
            {
                return NotFound(new RequestErrorObject
                {
                    ErrorCode = ErrorCode.NotFound,
                    Message = "QC Lot Do Not Exist!"
                });
            }

            var qcLotDTO = mapper.Map<List<AdminQCLotDTO>>(qcLotModels);

            return Ok(qcLotDTO);
        }

        [HttpGet]
        [Route("GetTemplateByName")]
        public async Task<IActionResult> GetQCTemplateByName([FromQuery] string? name, [FromQuery] string? dep)
        {
            AdminQCTemplate? qcTemplateModels;

            if (Enum.TryParse(dep, true, out Department department))
            {
                qcTemplateModels = await adminQCLotRepository.GetTemplateByName(name, department);
            }
            else
            {
                qcTemplateModels = await adminQCLotRepository.GetTemplateByName(name);
            }

            if (qcTemplateModels == null)
            {
                return NotFound(new RequestErrorObject
                {
                    ErrorCode = ErrorCode.NotFound,
                    Message = "Template Do Not Exist!"
                });
            }

            var qcTemplateDTO = mapper.Map<AdminQCTemplateDTO>(qcTemplateModels);

            return Ok(qcTemplateDTO);
        }

        [HttpGet]
        [Route("ByIdList")]
        public async Task<IActionResult> GetQCLotByIdList([FromQuery] List<Guid> lotId)
        {
            var qclotModels = await adminQCLotRepository.GetAdminQCLotsByIdList(lotId);

            var qclotDTOs = mapper.Map<List<AdminQCLotDTO>>(qclotModels);

            return Ok(qclotDTOs);
        }

        //[HttpGet]
        //[Route("ByName")]
        //public async Task<IActionResult> GetQCLotByName([FromQuery] string? name, [FromQuery] string? dep)
        //{
        //    AdminQCLot? qcLotModel;

        //    if (Enum.TryParse(dep, true, out Department department))
        //    {
        //        qcLotModel = await adminQCLotRepository.GetAdminQCLotByName(name, department);
        //    } else
        //    {
        //        qcLotModel = await adminQCLotRepository.GetAdminQCLotByName(name);
        //    }

        //    if (qcLotModel == null)
        //    {
        //        return NotFound(new RequestErrorObject
        //        {
        //            ErrorCode = ErrorCode.NotFound,
        //            Message = "QC Lot Do Not Exist!"
        //        });
        //    }

        //    var qcLotDTO = mapper.Map<AdminQCLotDTO>(qcLotModel);

        //    return Ok(qcLotDTO);
        //}

        [HttpGet]
        [Route("GetAllCustomNames")]
        public async Task<IActionResult> GetAllCustomNames()
        {
            var names = await adminQCLotRepository.GetAllUniqueCustomLotsName();

            return Ok(names);
        }

        [HttpGet]
        [Route("ByLotNumber/{lotNum}")]
        public async Task<IActionResult> GetQCLotByLotNumber([FromRoute] string lotNum)
        {
            var qcLotModel = await adminQCLotRepository.GetAdminQCLotByLotNumber(lotNum);

            if (qcLotModel == null)
            {
                return BadRequest(new RequestErrorObject
                {
                    ErrorCode = ErrorCode.NotFound,
                    Message = "QC Lot Do Not Exist!"
                });
            }

            var qcLotDTO = mapper.Map<AdminQCLotDTO>(qcLotModel);

            return Ok(qcLotDTO);
        }

        [HttpPost]
        public async Task<IActionResult> CreateQCLot([FromBody] AddAdminQCLotRequestDTO dto)
        {
            var qclotModel = new AdminQCLot
            {
                QCName = dto.QCName,
                LotNumber = dto.LotNumber,
                OpenDate = dto.OpenDate,
                ClosedDate = dto.ClosedDate,
                ExpirationDate = dto.ExpirationDate,
                IsActive = dto.IsActive,
                IsCustom = dto.IsCustom,
                IsOrderable = dto.IsOrderable,
                FileDate = dto.FileDate,
                Department = dto.Department,
                Analytes = new List<Analyte>(),
                Reports = new List<StudentReport>()
            };

            var checkExistingModel = await adminQCLotRepository.DoesLotNumberExist(qclotModel);

            if (checkExistingModel != null)
            {
                 return BadRequest(new RequestErrorObject
                 {
                     ErrorCode = ErrorCode.AlreadyExist,
                     Message = "Lot Number Already Exist!",
                 });
            }

            foreach (var analyteDTO in dto.Analytes)
            {
                if (analyteDTO != null)
                {
                    var analyteModel = mapper.Map<Analyte>(analyteDTO);

                    qclotModel.Analytes.Add(analyteModel);
                }
            }

            await adminQCLotRepository.CreateQCLot(qclotModel);

            var qclotDTO = mapper.Map<AdminQCLotDTO>(qclotModel);

            return Ok(qclotDTO);
        }

        [HttpPost]
        [Route("CreateTemplate")]
        public async Task<IActionResult> CreateQCTemplate([FromBody] AddAdminQCTemplateDTO dto)
        {
            var qcTemplateModel = new AdminQCTemplate
            {
                QCName = dto.QCName,
                IsCustom = dto.IsCustom,
                Department = dto.Department,
                AnalyteTemplates = new List<AnalyteTemplate>(),
            };

            foreach (var analyteDTO in dto.AnalyteTemplates)
            {
                if (analyteDTO != null)
                {
                    var analyteModel = mapper.Map<AnalyteTemplate>(analyteDTO);

                    qcTemplateModel.AnalyteTemplates.Add(analyteModel);
                }
            }

            var result = await adminQCLotRepository.CreateQCTemplate(qcTemplateModel);

            if (result == null)
            {
                return BadRequest(new RequestErrorObject
                {
                    ErrorCode = ErrorCode.AlreadyExist,
                    Message = "Name Already Exist!",
                });
            }

            var qcTemplateDTO = mapper.Map<AdminQCTemplateDTO>(qcTemplateModel);

            return Ok(qcTemplateModel);
        }

        //[HttpPost]
        //[Route("CreateCustomLot")]
        //public async Task<IActionResult> CreateCustomQCLot([FromBody] AddAdminQCLotRequestDTO dto)
        //{
        //    var qclotModel = new AdminQCLot
        //    {
        //        QCName = dto.QCName,
        //        LotNumber = dto.LotNumber,
        //        OpenDate = dto.OpenDate,
        //        ClosedDate = dto.ClosedDate,
        //        ExpirationDate = dto.ExpirationDate,
        //        IsActive = dto.IsActive,
        //        IsCustom = dto.IsCustom,
        //        FileDate = dto.FileDate,
        //        Department = dto.Department,
        //        Analytes = new List<Analyte>(),
        //        Reports = new List<StudentReport>()
        //    };

        //    foreach (var analyteDTO in dto.Analytes)
        //    {
        //        if (analyteDTO != null)
        //        {
        //            var analyteModel = mapper.Map<Analyte>(analyteDTO);

        //            qclotModel.Analytes.Add(analyteModel);
        //        }
        //    }

        //    var returnResult = await adminQCLotRepository.CreateCustomQCLot(qclotModel);

        //    if (returnResult == null)
        //    {
        //        return BadRequest(new RequestErrorObject
        //        {
        //            ErrorCode = ErrorCode.AlreadyExist,
        //            Message = "Name Already Exist or Not Custom Lot!",
        //        });
        //    }

        //    var adminQCLotDTO = mapper.Map<AdminQCLotDTO>(returnResult);

        //    return Ok(adminQCLotDTO);
        //}

        [HttpPatch]
        [Route("UpdateQCLot/{id:Guid}")]
        public async Task<IActionResult> UpdateQCLot([FromRoute] Guid id, [FromBody] UpdateAdminQCLotDTO dto)
        {

            var qclotModel = mapper.Map<AdminQCLot>(dto);

            qclotModel = await adminQCLotRepository.UpdateQCLot(id, qclotModel);

            if (qclotModel == null)
            {
                return BadRequest(new RequestErrorObject
                {
                    ErrorCode = ErrorCode.NotFound,
                    Message = "QC Lot Not Found"
                });
            }

            return Ok(qclotModel);
        }

        [HttpPatch]
        [Route("DeactivateQCLot/{id:Guid}")]
        public async Task<IActionResult> InactivateQCLot([FromRoute] Guid id)
        {
            var qclotModel = await adminQCLotRepository.InactivateQCLot(id);

            if (qclotModel == null)
            {
                return BadRequest(new RequestErrorObject
                {
                    ErrorCode = ErrorCode.NotFound,
                    Message = "QC Lot Not Found"
                });
            }

            return Ok(qclotModel);
        }

        [HttpPatch]
        [Route("SetIsOrderable")]
        public async Task<IActionResult> SetIsOrderable([FromBody] SetIsOrderableDTO dto)
        {
            var qcTemplateModel = await adminQCLotRepository.SetIsOrderable(dto.TemplateId, dto.IsOrderable);

            if (qcTemplateModel == null)
            {
                return BadRequest(new RequestErrorObject
                {
                    ErrorCode = ErrorCode.NotFound,
                    Message = "QC Template Not Found"
                });
            }

            var qcTemplateDTO = mapper.Map<AdminQCTemplateDTO>(qcTemplateModel);

            return Ok(qcTemplateDTO);
        }

        [HttpDelete]
        [Route("DeleteQCLot/{lotId:Guid}")]
        public async Task<IActionResult> DeleteQCLot([FromRoute] Guid lotId)
        {
            var qcLotModel = await adminQCLotRepository.DeleteQCLot(lotId);

            if (qcLotModel == null)
            {
                return BadRequest(new RequestErrorObject
                {
                    ErrorCode = ErrorCode.NotFound,
                    Message = "QC Lot Not Found"
                });
            }

            var qcLotDTO = mapper.Map<AdminQCLotDTO>(qcLotModel);

            return Ok(qcLotDTO);
        }

        [HttpDelete]
        [Route("DeleteCustomTemplate/{templateId:Guid}")]
        public async Task<IActionResult> DeleteCustomTemplate([FromRoute] Guid templateId)
        {
            var qcTemplateModel = await adminQCLotRepository.DeleteCustomTemplate(templateId);

            if (qcTemplateModel == null)
            {
                return BadRequest(new RequestErrorObject
                {
                    ErrorCode = ErrorCode.NotFound,
                    Message = "QC Lot Not Found"
                });
            }

            var qcTemplateDTO = mapper.Map<AdminQCTemplateDTO>(qcTemplateModel);

            return Ok(qcTemplateDTO);
        }

        //[HttpPatch]
        //[Route("ActivateCustomQC/{id:Guid}")]
        //public async Task<IActionResult> ActivateCustomQC([FromRoute] Guid id)
        //{
        //    var qcLotModel = await adminQCLotRepository.ActivateCustomQCLot(id);

        //    if (qcLotModel == null)
        //    {
        //        return BadRequest(new RequestErrorObject
        //        {
        //            ErrorCode = ErrorCode.NotFound,
        //            Message = "QC Lot Not Found"
        //        });
        //    }

        //    var qcLotDTO = mapper.Map<AdminQCLotDTO>(qcLotModel);

        //    return Ok(qcLotDTO);
        //}
    }
}
