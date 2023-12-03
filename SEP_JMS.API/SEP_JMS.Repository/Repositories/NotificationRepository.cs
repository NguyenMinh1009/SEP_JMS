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

        public async Task UpdateArchivedTime(Guid notificationId, bool isNull)
        {
            var archivedTime = isNull ? 0 : DateTime.UtcNow.Ticks;
            await Context.Notifications.Where(job => job.NotificationId == notificationId)
                .ExecuteUpdateAsync(notis => notis
                .SetProperty(noti => noti.ArchivedAt, noti => archivedTime));
        }

        public async Task UpdateReadTime(Guid notificationId, bool readAll = false)
        {
            var readTime = DateTime.UtcNow.Ticks;
            var query = from notis in Context.Notifications
                        select notis;
            if(!readAll)
            {
                query = query.Where(job => job.NotificationId == notificationId);
            }
            await query.ExecuteUpdateAsync(notis => notis
                .SetProperty(noti => noti.ReadAt, noti => readTime));
        }

        public async Task DeleteNotification(Guid notificationId, bool deleteAll)
        { 
            var count = await Context.Notifications.Where(noti=>noti.NotificationId == notificationId).ExecuteDeleteAsync();
        }

        public async Task DeleteByEntityId(Guid entityId)
        {
            var count = await Context.Notifications.Where(noti => noti.EntityIdentifier == entityId).ExecuteDeleteAsync();
        }

        public async Task DeleteByReceiver(Guid entityId, Guid receiverId)
        {
            var count = await Context.Notifications.Where(noti => noti.EntityIdentifier == entityId && noti.Receiver == receiverId).ExecuteDeleteAsync();
        }

        public async Task CreateNotification(Notification notification)
        {
            Context.Notifications.Add(notification);
            await Context.SaveChangesAsync();
        }

        public async Task<Tuple<int, PagingModel<Notification>>> GetNotifications(NotificationFilterRequest model)
        {
            var userId = ApiContext.Current.UserId;
            var query = from noti in Context.Notifications
                        where noti.Receiver == userId
                        select noti;
            model.Status ??= "all";
            if (model.Status.Equals("unread"))
                query = query.Where(e => e.ReadAt == null || e.ReadAt == 0);
            if (model.Status.Equals("archived"))
                query = query.Where(e => e.ArchivedAt > 0);

            var notifications = await query.OrderByDescending(job => job.CreatedTime)
                .Skip((model.PageIndex - 1) * model.PageSize)
                .Take(model.PageSize)
                .AsNoTracking()
                .ToListAsync();
            var count = await query.CountAsync();
            var unreadNotificationCount = await query.AsNoTracking().CountAsync(x => x.ReadAt == null || x.ReadAt == 0);
            return new Tuple<int, PagingModel<Notification>>(unreadNotificationCount, new PagingModel<Notification>
            {
                Items = notifications,
                Count = count
            });
        }

        public async Task UpdateTitle(Guid entityId, string newTitle)
        {
            await Context.Notifications.Where(job => job.EntityIdentifier == entityId)
                .ExecuteUpdateAsync(notis => notis
                .SetProperty(noti => noti.Title, noti => newTitle));
        }

        public async Task DeleteByReceiver(Guid receiverId)
        {
            await Context.Notifications.Where(noti => noti.Receiver == receiverId).ExecuteDeleteAsync();
        }
    }
}
