using SEP_JMS.Model;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Models;

namespace SEP_JMS.Repository.IRepositories
{
    public interface INotificationRepository : IBaseRepository<Notification>
    {
        public Task<Tuple<int, PagingModel<Notification>>> GetNotifications(NotificationFilterRequest model);
        public Task CreateNotification(Notification notification);
        public Task UpdateArchivedTime(Guid notificationId, bool isNull);
        public Task UpdateReadTime(Guid notificationId, bool readAll = false);
        public Task UpdateTitle(Guid entityId, string newTitle);
        public Task DeleteNotification(Guid notificationId, bool deleteAll = false);
        public Task DeleteByEntityId(Guid entityId);
        public Task DeleteByReceiver(Guid entityId, Guid receiverId);
        public Task DeleteByReceiver(Guid receiverId);
    }
}
