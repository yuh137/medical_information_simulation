using AutoMapper;
using ScrumDumpsterMolecularDiagnostic.Models.Domain;
using ScrumDumpsterMolecularDiagnostic.Models.DTO;

namespace ScrumDumpsterMolecularDiagnostic.Mappings
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles() 
        {
            CreateMap<Admin, AdminDTO>().ReverseMap();
            CreateMap<Student, StudentDTO>().ReverseMap();
            CreateMap<AdminQCLot, AdminQCLotDTO>().ReverseMap();
            CreateMap<Analyte, AnalyteDTO>().ReverseMap();
            CreateMap<Analyte, AddAnalyteRequestDTO>().ReverseMap();
            CreateMap<AdminQCLot, AddAdminQCLotRequestDTO>().ReverseMap();
            CreateMap<AddAnalyteWithListDTO, Analyte>().ReverseMap();
            CreateMap<StudentReportDTO, StudentReport>().ReverseMap();
            CreateMap<UpdateAdminQCLotDTO, AdminQCLot>().ReverseMap();
        }
    }
}
