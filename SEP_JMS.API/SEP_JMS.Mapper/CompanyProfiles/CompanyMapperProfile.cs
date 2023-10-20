using AutoMapper;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Api.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Mapper.CompanyProfiles
{
    public class CompanyModelToCompanyDisplayModelMapperProfile : Profile
    {
        public CompanyModelToCompanyDisplayModelMapperProfile()
        {
            CreateMap<Model.Models.Company, CompanyDisplayModel>().ReverseMap();
        }
    }
    public class CompanyCreateRequestModelToCompanyModelMapperProfile : Profile
    {
        public CompanyCreateRequestModelToCompanyModelMapperProfile()
        {
            CreateMap<CompanyCreateRequestModel, Model.Models.Company>()
                .ForMember(des => des.CompanyId, opt => opt.MapFrom(src => Guid.NewGuid()));
        }
    }
}
