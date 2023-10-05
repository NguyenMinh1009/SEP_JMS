using AutoMapper;
using Newtonsoft.Json;
using SEP_JMS.Common;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Models;

namespace SEP_JMS.Mapper.NotificationProfiles
{
    public class NotificationCreateProfile : Profile
    {
        public NotificationCreateProfile() 
        {
            CreateMap<NotiCreationRequest, Notification>()
                .ForMember(dest => dest.ReadAt, opt => opt.MapFrom(src => 0))
                .ForMember(dest => dest.NotificationId, opt => opt.MapFrom(src => Guid.NewGuid()))
                .ForMember(dest => dest.ArchivedAt, opt => opt.MapFrom(src => 0))
                .ForMember(dest => dest.Message, opt => opt.MapFrom(src => src.Message))
                .ForMember(dest => dest.Data, opt => opt.MapFrom(src => src.Data))
                .ForMember(dest => dest.EntityIdentifier, opt => opt.MapFrom(src => src.EntityIdentifier))
                .ForMember(dest => dest.EntityName, opt => opt.MapFrom(src => src.EntityName))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => dest.Receiver, opt => opt.MapFrom(src => JsonConvert.SerializeObject(src.Receivers)))
                .ForMember(dest => dest.TriggerBy, opt => opt.MapFrom(src => ApiContext.Current.UserId))
                .ForMember(dest => dest.CreatedTime, opt => opt.MapFrom(src => DateTime.Now.Ticks));
        }
    }
}
