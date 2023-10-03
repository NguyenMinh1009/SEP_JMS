using AutoMapper;
using SEP_JMS.Model.Api.Response.User;
using SEP_JMS.Model.Models;

namespace SEP_JMS.Mapper.UserProfiles
{
    public class EmployeeResponseProfile : Profile
    {
        public EmployeeResponseProfile() 
        {
            CreateMap<User, EmployeeResponse>();
        }
    }
}
