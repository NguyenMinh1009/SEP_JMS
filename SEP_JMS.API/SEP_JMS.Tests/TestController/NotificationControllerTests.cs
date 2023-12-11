using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SEP_JMS.Common.Utils;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Api.Response;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Model;
using SEP_JMS.Service.Services;
using SEP_JMS.API.Controllers;
using SEP_JMS.Common.Logger;
using SEP_JMS.Service.IServices;
using Moq;
using Microsoft.Extensions.Configuration;
using SEP_JMS.Model.Models;
using Moq.Protected;
using Microsoft.SqlServer.Server;
using AutoMapper.Execution;

namespace SEP_JMS.Tests.TestController
{
    [TestFixture]
    public class NotificationControllerTests
    {
        private readonly Mock<INotificationService> moqNotificationService = new();
        private readonly Mock<IJMSLogger> moqLogger = new();

        private NotificationController notificationController = null!;

        [SetUp]
        public void Setup()
        {
            notificationController = new(moqNotificationService.Object, moqLogger.Object);
            moqLogger.Setup(a => a.Info(It.IsAny<string>())).Verifiable();
            moqLogger.Setup(a => a.Warn(It.IsAny<string>())).Verifiable();
            moqLogger.Setup(a => a.Error(It.IsAny<string>())).Verifiable();
        }

        [TestCase]
        public async Task ConfigureNotification_ValidRequest_ReturnOk()
        {
            var ll = new List<NotiType>() { NotiType.FromJob, NotiType.FromComment };
            moqNotificationService.Setup(u => u.ConfigureNotification(ll)).Returns(Task.CompletedTask);

            var resp = await notificationController.ConfigureNotification(ll);

            // Assert
            Assert.That(resp.StatusCode, Is.EqualTo(200));
        }

        [TestCase]
        public async Task ConfigureNotification_InvalidRequest_ReturnBadRequest()
        {
            var ll = new List<NotiType>() { NotiType.FromJob, NotiType.FromComment };
            moqNotificationService.Setup(u => u.ConfigureNotification(ll)).ThrowsAsync(new Exception("exception"));

            var resp = await notificationController.ConfigureNotification(ll);

            // Assert
            Assert.That(resp.StatusCode, Is.EqualTo(500));
        }

        [TestCase]
        public async Task DeleteNotification_InvalidRequest_ReturnBadRequest()
        {
            var id = Guid.NewGuid();
            moqNotificationService.Setup(u => u.DeleteNotification(id)).ThrowsAsync(new Exception("not found"));

            var resp = await notificationController.DeleteNotification(id);

            // Assert
            Assert.That(resp.StatusCode, Is.EqualTo(500));
        }

        [TestCase]
        public async Task DeleteNotification_ValidRequest_ReturnOk()
        {
            var id = Guid.NewGuid();
            moqNotificationService.Setup(u => u.DeleteNotification(id)).Returns(Task.CompletedTask);

            var resp = await notificationController.DeleteNotification(id);

            // Assert
            Assert.That(resp.StatusCode, Is.EqualTo(204));
        }

        [TestCase]
        public async Task ReadNotification_InvalidRequest_ReturnBadRequest()
        {
            var id = Guid.NewGuid();
            moqNotificationService.Setup(u => u.ReadNotification(id)).ThrowsAsync(new Exception("not found"));

            var resp = await notificationController.ReadNotification(id);

            // Assert
            Assert.That(resp.StatusCode, Is.EqualTo(500));
        }

        [TestCase]
        public async Task ReadNotification_ValidRequest_ReturnOk()
        {
            var id = Guid.NewGuid();
            moqNotificationService.Setup(u => u.ReadNotification(id)).Returns(Task.CompletedTask);

            var resp = await notificationController.ReadNotification(id);

            // Assert
            Assert.That(resp.StatusCode, Is.EqualTo(200));
        }

    }
}
