using SEP_JMS.Model;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Models;

namespace SEP_JMS.Repository.IRepositories
{
    public interface INotificationRepository : IBaseRepository<Notification>
    {
        public Task<PagingModel<Notification>> GetNotifications(NotificationFilterRequest model);
        public Task CreateNotification(Notification notification);
        public Task UpdateArchivedTime(Guid notificationId);
        public Task UpdateReadTime(Guid notificationId, bool readAll = false);
        public Task DeleteNotification(Guid notificationId, bool deleteAll = false);
    }
}
