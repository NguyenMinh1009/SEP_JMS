using AutoMapper;
using Newtonsoft.Json;
using SEP_JMS.Common;
using SEP_JMS.Common.Constants;
using SEP_JMS.Common.Logger;
using SEP_JMS.Model;
using SEP_JMS.Model.Api.Request;
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
        public async Task<Guid> CreateNotification(NotiCreationRequest model, NotiAction action)
        {
            var receivers = await userRepository.GetAll(user=>model.Receivers.Contains(user.UserId));
            model.Message = GenerateMassage(action, ApiContext.Current.Username, model.EntityIdentifier);
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
        public async Task<Tuple<int,PagingModel<NotificationResponse>>> GetNotifications(NotificationFilterRequest requestModel)
        {
            var notificationEntity = await notificationRepository.GetNotifications(requestModel);
            var notifications = mapper.Map<List<NotificationResponse>>(notificationEntity.Item2.Items);
            return new Tuple<int, PagingModel<NotificationResponse>>(notificationEntity.Item1, new PagingModel<NotificationResponse>()
            {
                Items = notifications,
                Count = notificationEntity.Item2.Count
            });
        }
        public async Task ConfigureNotification(List<NotiType> types)
        {
            await userRepository.UpdateNotiConfiguration(ApiContext.Current.UserId, types);
        }
        public async Task DeleteNotification(Guid id)
        {
            await notificationRepository.DeleteNotification(id);
        }
        public async Task ReadNotification(Guid id)
        {
            await notificationRepository.UpdateReadTime(id);
        }
        public async Task ArchiveNotification(Guid id)
        {
            await notificationRepository.UpdateArchivedTime(id, false);
        }
        public async Task ReadAllNotification()
        {
            await notificationRepository.UpdateReadTime(Guid.Empty, true);
        }

        private string GenerateMassage(NotiAction action, string userName, Guid id)
        {
            switch (action)
            {
                case NotiAction.CreateJob:
                    return $"{userName} đã {ActionConstants.CreateJob}!";
                case NotiAction.UpdateJob:
                    return $"{userName} đã {ActionConstants.UpdateJob}!";
                case NotiAction.Comment:
                    return $"{userName} đã {ActionConstants.Comment}!";
                default:
                    break;
            }
            return null!;
        }

        public async Task UnArchiveNotification(Guid id)
        {
            await notificationRepository.UpdateArchivedTime(id, true);
        }
    }
}
