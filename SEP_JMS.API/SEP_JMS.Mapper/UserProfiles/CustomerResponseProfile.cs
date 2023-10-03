using AutoMapper;
using SEP_JMS.Model.Api.Response.User;
using SEP_JMS.Model.Models;

namespace SEP_JMS.Mapper.UserProfiles
{
    public class CustomerResponseProfile : Profile
    {
        public CustomerResponseProfile() 
        {
            CreateMap<User, CustomerResponse>();
        }
    }
}
