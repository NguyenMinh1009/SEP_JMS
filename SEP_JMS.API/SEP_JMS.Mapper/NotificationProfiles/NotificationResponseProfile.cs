using AutoMapper;
using Newtonsoft.Json;
using SEP_JMS.Common;
using SEP_JMS.Model.Api.Response;
using SEP_JMS.Model.Models;

namespace SEP_JMS.Mapper.NotificationProfiles
{
    public class NotificationResponseProfile : Profile
    {
        public NotificationResponseProfile() 
        {
            CreateMap<NotificationResponse, Notification>()
                .ForMember(dest => dest.ReadAt, opt => opt.MapFrom(src => src.ReadAt))
                .ForMember(dest => dest.ArchivedAt, opt => opt.MapFrom(src => src.ArchivedAt))
                .ForMember(dest => dest.Message, opt => opt.MapFrom(src => src.Message))
                .ForMember(dest => dest.Data, opt => opt.MapFrom(src => src.Data))
                .ForMember(dest => dest.EntityIdentifier, opt => opt.MapFrom(src => src.EntityIdentifier))
                .ForMember(dest => dest.EntityName, opt => opt.MapFrom(src => src.EntityName))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => dest.Receiver, opt => opt.MapFrom(src => src.Receiver))
                .ForMember(dest => dest.TriggerBy, opt => opt.MapFrom(src => src.TriggerBy))
                .ForMember(dest => dest.CreatedTime, opt => opt.MapFrom(src => src.CreatedTime));
            CreateMap<Notification, NotificationResponse>()
                .ForMember(dest => dest.Receiver, opt => opt.MapFrom(src => JsonConvert.DeserializeObject<List<Guid>>(src.Receiver)));
        }
    }
}
