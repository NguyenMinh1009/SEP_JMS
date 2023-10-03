using AutoMapper;
using Newtonsoft.Json;
using SEP_JMS.Model.Api.Response.Job;
using SEP_JMS.Model.Models;
using SEP_JMS.Model.Models.ExtensionModels;

namespace SEP_JMS.Mapper.JobProfiles
{
    public class JobResponseProfile : Profile
    {
        public JobResponseProfile()
        {
            CreateMap<Job, JobResponse>()
                .ForMember(dest => dest.Customer, opt => opt.Ignore())
                .ForMember(dest => dest.Account, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.Company, opt => opt.Ignore())
                .ForMember(dest => dest.JobType, opt => opt.Ignore())
                .ForMember(dest => dest.Requirements, opt => opt.MapFrom(src => JsonConvert.DeserializeObject<FolderItem>(src.Requirements ?? string.Empty)))
                .ForMember(dest => dest.FinalProducts, opt => opt.MapFrom(src => JsonConvert.DeserializeObject<FolderItem>(src.FinalProducts ?? string.Empty)))
                .ForMember(dest => dest.PreviewProducts, opt => opt.MapFrom(src => JsonConvert.DeserializeObject<FolderItem>(src.FinalPreview ?? string.Empty)));
        }
    }
}
