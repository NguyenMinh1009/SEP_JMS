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
using SEP_JMS.Model.Api.Request.User;
using System.Xml.Linq;

namespace SEP_JMS.Tests.TestController
{
    [TestFixture]
    public class JobTypeControllerTests
    {
        private readonly Mock<IJobTypeService> moqJobTypeService = new();
        private readonly Mock<IJMSLogger> moqLogger = new();

        private JobTypeController jobTypeController = null!;

        [SetUp]
        public void Setup()
        {
            jobTypeController = new(moqJobTypeService.Object, moqLogger.Object);
            moqLogger.Setup(a => a.Info(It.IsAny<string>())).Verifiable();
            moqLogger.Setup(a => a.Warn(It.IsAny<string>())).Verifiable();
            moqLogger.Setup(a => a.Error(It.IsAny<string>())).Verifiable();
        }

        [TestCase("", 400)]
        [TestCase("ABC", 200)]
        public async Task CreateJobType_ValidRequest_ReturnValidResponse(string? name, int expectedCode = 200)
        {
            moqJobTypeService.Setup(u => u.CreateJobType(name)).ReturnsAsync(true);

            var resp = await jobTypeController.CreateJobType(name);

            // Assert
            Assert.That(resp.StatusCode, Is.EqualTo(expectedCode));
        }

        [TestCase("", 400)]
        [TestCase("ABC", 200)]
        public async Task UpdateJobType_ValidRequest_ReturnValidResponse(string? name, int expectedCode = 200)
        {
            moqJobTypeService.Setup(u => u.UpdateJobType(It.Is<Guid>(e => e!= null), name)).ReturnsAsync(true);

            var resp = await jobTypeController.UpdateJobType(Guid.NewGuid(), name);

            // Assert
            Assert.That(resp.StatusCode, Is.EqualTo(expectedCode));
        }

        [TestCase]
        public async Task DeleteJobType_InvalidRequest_ReturnBadRequest()
        {
            var id = Guid.NewGuid();
            moqJobTypeService.Setup(u => u.DeleteJobType(id)).ThrowsAsync(new Exception("not found"));

            var resp = await jobTypeController.DeleteJobType(id);

            // Assert
            Assert.That(resp.StatusCode, Is.EqualTo(400));
        }

        [TestCase]
        public async Task DeleteJobType_ValidRequest_ReturnOk()
        {
            var id = Guid.NewGuid();
            moqJobTypeService.Setup(u => u.DeleteJobType(id)).ReturnsAsync(true);

            var resp = await jobTypeController.DeleteJobType(id);

            // Assert
            Assert.That(resp.StatusCode, Is.EqualTo(200));
        }
    }
}
