using AutoMapper;
using Medical_Information.API.Models.Domain;
using Medical_Information.API.Models.DTO;

namespace Medical_Information.API.Mappings
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles() 
        {
            CreateMap<Admin, AdminDTO>().ReverseMap();
            CreateMap<Admin, AddAdminRequestDTO>().ReverseMap();
            CreateMap<Admin, UpdatePasswordDTO>().ReverseMap();
            CreateMap<Student, StudentDTO>().ReverseMap();
            CreateMap<Student, AddStudentRequestDTO>().ReverseMap();
            CreateMap<AdminQCLot, AdminQCLotDTO>().ReverseMap();
            CreateMap<Analyte, AnalyteDTO>().ReverseMap();
            CreateMap<Analyte, AddAnalyteRequestDTO>().ReverseMap();
            CreateMap<AdminQCLot, AddAdminQCLotRequestDTO>().ReverseMap();
        }
    }
}
