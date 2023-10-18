using AutoMapper;
using SEP_JMS.Model.Api.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Mapper.UserProfiles
{
    public class UserDetailsMapperProfile : Profile
    {
        public UserDetailsMapperProfile()
        {
            CreateMap<Model.Models.User, UserDetailsDisplayModel>()
                .ForMember(des => des.Company, opt => opt.Ignore());
        }
    }
}
