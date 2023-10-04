using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using SEP_JMS.Common;
using SEP_JMS.Model;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Models;
using SEP_JMS.Model.Models.ExtensionModels;
using SEP_JMS.Repository.IRepositories;

namespace SEP_JMS.Repository.Repositories
{
    public class NotificationRepository : BaseRepository<Notification>, INotificationRepository
    {
        public NotificationRepository(JSMContext context) : base(context)
        {
        }

        public async Task UpdateArchivedTime(Guid notificationId)
        {
            await Context.Notifications.Where(job => job.NotificationId == notificationId)
                .ExecuteUpdateAsync(notis => notis
                .SetProperty(noti => noti.ArchivedAt, noti => DateTime.Now.Ticks));
        }

        public async Task UpdateReadTime(Guid notificationId, bool readAll = false)
        {
            var query = from notis in Context.Notifications
                        select notis;
            if(!readAll)
            {
                query = query.Where(job => job.NotificationId == notificationId);
            }
            await query.ExecuteUpdateAsync(notis => notis
                .SetProperty(noti => noti.ReadAt, noti => DateTime.Now.Ticks));
        }

        public async Task DeleteNotification(Guid notificationId, bool deleteAll)
        {
            var query = from notis in Context.Notifications
                        select notis;
            if (!deleteAll)
            {
                query = query.Where(job => job.NotificationId == notificationId);
            }
            await Context.Notifications.Where(noti=>noti.NotificationId == notificationId).ExecuteDeleteAsync();
        }

        public async Task CreateNotification(Notification notification)
        {
            Context.Notifications.Add(notification);
            await Context.SaveChangesAsync();
        }

        public async Task<PagingModel<Notification>> GetNotifications(NotificationFilterRequest model)
        {
            var userId = ApiContext.Current.UserId;
            var query = from noti in Context.Notifications
                        where model.Unread == (noti.ReadAt <=0)
                        select noti;
            var notifications = await query.OrderByDescending(job => job.CreatedTime)
                .Skip((model.PageIndex - 1) * model.PageSize)
                .Take(model.PageSize)
                .AsNoTracking()
                .ToListAsync();
            var count = await query.CountAsync();
            return new PagingModel<Notification>
            {
                Items = notifications,
                Count = count
            };
        }
    }
}
