using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Api.Response;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Model;

namespace SEP_JMS.Service.IServices
{
    public interface INotificationService
    {
        public Task<Guid> CreateNotification(NotiCreationRequest model, NotiAction action);
        public Task<Tuple<int, PagingModel<NotificationResponse>>> GetNotifications(NotificationFilterRequest requestModel);
        public Task DeleteNotification(Guid id);
        public Task ConfigureNotification(List<NotiType> types);
        public Task ReadNotification(Guid id);
        public Task ArchiveNotification(Guid id);
        public Task UnArchiveNotification(Guid id);
        public Task ReadAllNotification();
    }
}
