﻿using AutoMapper;
using SEP_JMS.Model.Api.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Mapper.EmployeeProfiles
{
    public class UserModelToAccountDetailsDisplayModelMapperProfile : Profile
    {
        public UserModelToAccountDetailsDisplayModelMapperProfile()
        {
            CreateMap<Model.Models.User, AccountDetailsDisplayModel>();
        }
    }
}
