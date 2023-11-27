using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Models;
using SEP_JMS.Repository.IRepositories;
using SEP_JMS.Repository.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.Xml;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Tests.Repositories
{
    [TestFixture]
    public class NotificationRepositoryTests
    {
        INotificationRepository _notiRepository;
        List<Notification> testNotifications;
        private int _total = 20;
        private int _unReadCount = 0;
        private int _archivedCount = 0;

        [SetUp]
        public async Task Setup()
        {

            _notiRepository = ContextGenerator.GetRepository<NotificationRepository, Notification>();
            testNotifications = new List<Notification>();

            // clear all before tests
            ContextGenerator.Instance.Notifications.RemoveRange(ContextGenerator.Instance.Notifications);
            await ContextGenerator.Instance.SaveChangesAsync();
            _unReadCount = _archivedCount = 0;
            var _rnd = new Random();
            // Add new Notifications
            for (int i = 0; i < _total; i++) {
                var notiType = _rnd.Next(3);
                var testNoti = new Notification();
                testNoti.NotificationId = Guid.NewGuid();
                testNoti.EntityIdentifier = Guid.NewGuid();
                testNoti.EntityName = string.Empty;
                testNoti.Title = string.Empty;
                testNoti.Message = string.Empty;
                testNoti.Data = string.Empty;
                testNoti.TriggerBy = Guid.NewGuid();
                testNoti.Receiver = Guid.Empty;
                testNoti.CreatedTime = 1;

                if (notiType == 0)
                {
                    testNoti.ReadAt = 1;
                }

                if (notiType == 1)
                {
                    testNoti.ArchivedAt = 1;
                    _archivedCount++;
                }

                if (notiType != 0)
                {
                    _unReadCount++;
                }

                testNotifications.Add(testNoti);
                await _notiRepository.CreateNotification(testNoti);
            }
        }

        [Test]
        public async Task GetNotifications_GetAll_ShouldReturnCorrect()
        {
            var filter = new NotificationFilterRequest();
            filter.Status = "all";
            filter.PageIndex = 1;
            filter.PageSize = 10;
            var results = await _notiRepository.GetNotifications(filter);
            Assert.That(results.Item2.Count, Is.EqualTo(_total));
        }

        [Test]
        public async Task GetNotifications_GetUnRead_ShouldReturnCorrect()
        {
            var filter = new NotificationFilterRequest();
            filter.Status = "unread";
            filter.PageIndex = 1;
            filter.PageSize = 10;
            var results = await _notiRepository.GetNotifications(filter);
            Assert.That(results.Item2.Count, Is.EqualTo(_unReadCount));
        }

        [Test]
        public async Task GetNotifications_GetArchived_ShouldReturnCorrect()
        {
            var filter = new NotificationFilterRequest();
            filter.Status = "archived";
            filter.PageIndex = 1;
            filter.PageSize = 10;
            var results = await _notiRepository.GetNotifications(filter);
            Assert.That(results.Item2.Count, Is.EqualTo(_archivedCount));
        }
    }
}
