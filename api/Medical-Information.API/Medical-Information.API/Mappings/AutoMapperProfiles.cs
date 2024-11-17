using AutoMapper;
using Medical_Information.API.Models.Domain;
using Medical_Information.API.Models.DTO;
using Medical_Information.API.Enums;

namespace Medical_Information.API.Mappings
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Admin, AdminDTO>().ReverseMap();
            CreateMap<Student, StudentDTO>().ReverseMap();
            CreateMap<AdminQCLot, AdminQCLotDTO>().ReverseMap();
            CreateMap<UpdateAdminQCLotDTO, AdminQCLot>().ReverseMap();
            CreateMap<AdminQCLot, AddAdminQCLotRequestDTO>().ReverseMap();
            CreateMap<Analyte, AnalyteDTO>().ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()))
                .ReverseMap()
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => Enum.Parse<AnalyteType>(src.Type)));
            CreateMap<Analyte, AddAnalyteRequestDTO>().ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()))
                .ReverseMap()
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => Enum.Parse<AnalyteType>(src.Type)));
            CreateMap<AddAnalyteWithListDTO, Analyte>().ForMember(dest => dest.Type, opt => opt.MapFrom(src => Enum.Parse<AnalyteType>(src.Type)))
                .ReverseMap()
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()));
            CreateMap<StudentReportDTO, StudentReport>().ReverseMap();
            CreateMap<AddStudentReportDTO, StudentReport>().ReverseMap();
            CreateMap<AnalyteInput, AnalyteInputDTO>().ReverseMap();
            CreateMap<AnalyteInput, AddAnalyteInputWithListDTO>().ReverseMap();
        }
    }
}
