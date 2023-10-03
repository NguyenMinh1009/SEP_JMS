using AutoMapper;
using SEP_JMS.Model.Api.Request.Job;
using SEP_JMS.Common.Converters;
using SEP_JMS.Model.Models;

namespace SEP_JMS.Mapper.JobProfiles
{
    public class JobCreateProfile : Profile
    {
        public JobCreateProfile()
        {
            var now = DateTime.UtcNow.Ticks;
            CreateMap<CreateJobRequest, Job>()
                .ForMember(dest => dest.JobId, opt => opt.MapFrom(src => Guid.NewGuid()))
                .ForMember(dest => dest.ParentId, opt => opt.MapFrom(src => src.ParentId))
                .ForMember(dest => dest.Requirements, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedTime, opt => opt.MapFrom(src => now))
                .ForMember(dest => dest.LastUpdated, opt => opt.MapFrom(src => now))
                .ForMember(dest => dest.FinalProducts, opt => opt.Ignore())

                .ForMember(dest => dest.InternalJobStatus, opt => opt.MapFrom(src => src.JobStatus.ToInternalJobStatus()))
                .ForMember(dest => dest.InternalLastUpdated, opt => opt.MapFrom(src => now));
        }
    }
}
