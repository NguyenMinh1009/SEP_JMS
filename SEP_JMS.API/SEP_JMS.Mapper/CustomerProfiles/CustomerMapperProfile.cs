using AutoMapper;
using SEP_JMS.Model.Api.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Mapper.CustomerProfiles
{
    public class UserModelToUserCommonDisplayModelMapperProfile : Profile
    {
        public UserModelToUserCommonDisplayModelMapperProfile()
        {
            CreateMap<Model.Models.User, UserCommonDisplayModel>();
        }
    }
    public class UserModelToCustomerBasicDisplayModelMapperProfile : Profile
    {
        public UserModelToCustomerBasicDisplayModelMapperProfile()
        {
            CreateMap<Model.Models.User, CustomerBasicDisplayModel>();
        }
    }
}
