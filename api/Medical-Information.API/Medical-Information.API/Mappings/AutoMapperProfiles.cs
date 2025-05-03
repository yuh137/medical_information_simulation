﻿using AutoMapper;
using Medical_Information.API.Models.Domain;
using Medical_Information.API.Models.DTO;

namespace Medical_Information.API.Mappings
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
            CreateMap<StudentReport, AddStudentReportDTO>().ReverseMap();
            CreateMap<AdminAnalyteReport, AdminAnalyteReportDTO>().ReverseMap();
            CreateMap<AdminAnalyteReport, AddAdminReportDTO>().ReverseMap();
            CreateMap<AnalyteInput, AnalyteInputDTO>().ReverseMap();
            CreateMap<AdminQCTemplate, AdminQCTemplateDTO>().ReverseMap();
            CreateMap<AdminQCTemplate, AddAdminQCTemplateDTO>().ReverseMap();
            CreateMap<AnalyteTemplate, AnalyteTemplateDTO>().ReverseMap();
            CreateMap<AnalyteTemplate, AddAnalyteTemplateWithListDTO>().ReverseMap();
        }
    }
}
