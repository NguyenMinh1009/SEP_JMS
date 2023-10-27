using AutoMapper;
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
    public class UserModelToEmployeeBasicDisplayModelMapperProfile : Profile
    {
        public UserModelToEmployeeBasicDisplayModelMapperProfile()
        {
            CreateMap<Model.Models.User, EmployeeBasicDisplayModel>();
        }
    }
    public class UserModelToAccountFindDisplayModelMapperProfile : Profile
    {
        public UserModelToAccountFindDisplayModelMapperProfile()
        {
            CreateMap<Model.Models.User, AccountFindDisplayModel>();
        }
    }
}
