using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Api.Response;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Model;
using SEP_JMS.Model.Api.Request.Job;
using SEP_JMS.Model.Models;

namespace SEP_JMS.Service.IServices
{
    public interface INotificationService
    {
        public Task<Guid> CreateNotification(NotiCreationRequest model, NotiAction action);
        public Task<Guid> Trigger(Guid jobId, Job? oldJob, string? commentContent, NotiAction action);
        public Task<Tuple<int, PagingModel<NotificationResponse>>> GetNotifications(NotificationFilterRequest requestModel);
        public Task DeleteNotification(Guid id);
        public Task DeleteByEntityId(Guid entityId);
        public Task DeleteByReceiver(Guid entityId, Guid receiverId);
        public Task DeleteByReceiver(Guid receiverId);
        public Task ConfigureNotification(List<NotiType> types);
        public Task ReadNotification(Guid id);
        public Task ArchiveNotification(Guid id);
        public Task UnArchiveNotification(Guid id);
        public Task UpdateTitle(Guid entityId, string newTitle);
        public Task ReadAllNotification();
    }
}
