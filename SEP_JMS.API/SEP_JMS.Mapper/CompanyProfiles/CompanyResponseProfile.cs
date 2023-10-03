using AutoMapper;
using SEP_JMS.Model.Api.Response.Company;
using SEP_JMS.Model.Models;

namespace SEP_JMS.Mapper.CompanyProfiles
{
    public class CompanyResponseProfile : Profile
    {
        public CompanyResponseProfile() 
        {
            CreateMap<Company, CompanyResponse>();
        }
    }
}
