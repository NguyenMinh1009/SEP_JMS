using AutoMapper;
using Newtonsoft.Json;
using SEP_JMS.Common.Logger;
using SEP_JMS.Model;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Api.Request.Notification;
using SEP_JMS.Model.Api.Response;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Model.Models;
using SEP_JMS.Repository.IRepositories;
using SEP_JMS.Service.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Service.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository notificationRepository;
        private readonly IUserRepository userRepository;

        private readonly IJMSLogger logger;
        private readonly IMapper mapper;
        public NotificationService(IMapper mapper, IJMSLogger logger, INotificationRepository notificationRepository, IUserRepository userRepository)
        {
            this.notificationRepository = notificationRepository;
            this.mapper = mapper;
            this.logger = logger;
            this.userRepository = userRepository;
        }
        public async Task<Guid> CreateNotification(NotiCreationRequest model)
        {
            var receivers = await userRepository.GetAll(user=>model.Receivers.Contains(user.UserId));
            foreach (var user in receivers)
            {
                var notiConfig = JsonConvert.DeserializeObject<List<NotiType>>(user.NotificationConfig);
                if (notiConfig==null || !notiConfig.Contains(model.NotiType))
                {
                    model.Receivers.Remove(user.UserId);
                }
            }
            var notiModel = mapper.Map<Notification>(model);
            var notification = await notificationRepository.Add(notiModel);
            return notification.NotificationId;
        }
        public async Task<PagingModel<NotificationResponse>> GetNotifications(NotificationFilterRequest requestModel)
        {
            var notificationEntity = await notificationRepository.GetNotifications(requestModel);
            var notifications = mapper.Map<List<NotificationResponse>>(notificationEntity.Items);
            return new PagingModel<NotificationResponse>()
            {
                Items = notifications,
                Count = notificationEntity.Count
            };
        }
    }
}
