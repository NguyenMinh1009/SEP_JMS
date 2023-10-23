using AutoMapper;
using SEP_JMS.Model.Api.Response;
using SEP_JMS.Model.Api.Response.JobType;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Mapper.JobTypeProfiles
{
    public class JobTypeModelToJobTypeDisplayModelMapperProfile : Profile
    {
        public JobTypeModelToJobTypeDisplayModelMapperProfile()
        {
            CreateMap<Model.Models.JobType, JobTypeDisplayModel>().ReverseMap();
        }
    }
}
