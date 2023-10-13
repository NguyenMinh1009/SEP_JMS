using AutoMapper;
using SEP_JMS.Model.Api.Response.User;
using SEP_JMS.Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Mapper.UserProfiles
{
    public class UpdateUserRequestProfile : Profile
    {
        public UpdateUserRequestProfile()
        {
            CreateMap<UpdateUserRequestProfile, User>();
        }
    }
}
