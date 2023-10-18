using AutoMapper;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Enums.System;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Mapper.UserProfiles
{
    public class CustomerCreateRequestModelToUserModelMapperProfile : Profile
    {
        public CustomerCreateRequestModelToUserModelMapperProfile()
        {
            var now = DateTime.UtcNow.Ticks;
            CreateMap<CustomerCreateRequestModel, Model.Models.User>()
                .ForMember(des => des.AccountStatus, opt => opt.MapFrom(src => AccountStatus.Active))
                .ForMember(des => des.CreatedTime, opt => opt.MapFrom(src => now))
                .ForMember(des => des.RoleType, opt => opt.MapFrom(src => RoleType.Customer))
                .ForMember(des => des.UserId, opt => opt.MapFrom(src => Guid.NewGuid()));
        }
    }
}
