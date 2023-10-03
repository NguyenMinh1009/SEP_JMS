using AutoMapper;
using SEP_JMS.Model.Api.Response.JobType;
using SEP_JMS.Model.Models;

namespace SEP_JMS.Mapper.JobTypeProfiles
{
    public class JobTypeResponseProfile : Profile
    {
        public JobTypeResponseProfile() 
        {
            CreateMap<JobType, JobTypeResponse>();
        }
    }
}
