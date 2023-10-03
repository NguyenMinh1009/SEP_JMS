using AutoMapper;
using SEP_JMS.Model.Api.Response.User;
using SEP_JMS.Model.Models;

namespace SEP_JMS.Mapper.UserProfiles
{
    public class UserResponseProfile : Profile
    {
        public UserResponseProfile() 
        {
            CreateMap<User, UserResponse>();
        }
    }
}
