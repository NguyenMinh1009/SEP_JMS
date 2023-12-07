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

namespace SEP_JMS.Tests.TestController
{
    [TestFixture]
    public class AdminControllerTests
    {
        private readonly Mock<ICompanyService> moqCompanyService = new();
        private readonly Mock<IUserService> moqUserService = new();
        private readonly Mock<IPriceService> moqPriceService = new();
        private readonly Mock<IConfiguration> moqConfiguration = new();
        private readonly Mock<IJMSLogger> moqLogger = new();

        private AdminController adminController = null!;

        [SetUp]
        public void Setup()
        {
            adminController = new(moqCompanyService.Object, moqUserService.Object, moqPriceService.Object, moqConfiguration.Object, Global.Mapper, moqLogger.Object);
            moqLogger.Setup(a => a.Info(It.IsAny<string>())).Verifiable();
            moqLogger.Setup(a => a.Warn(It.IsAny<string>())).Verifiable();
            moqLogger.Setup(a => a.Error(It.IsAny<string>())).Verifiable();
        }

        #region ThaiNV
        [TestCase("abc01", "12345678", 400, "Password invalid format")]
        [TestCase("thai@!", "12345678@", 400, "Username invalid format")]
        [TestCase("thai nguyn", "12345678@", 400, "Username invalid format")]
        public async Task CreateEmployee_VerifyUserNameAndPassword_ReturnValidResponse(string userName, string password, int expectedCode, string? errMessage)
        {
            // Arrange
            var req = new EmployeeCreateRequestModel();
            req.Username = userName;
            req.Password = password;
            var eId = Guid.NewGuid();

            moqUserService.Setup(u => u.CreateEmployee(req)).ReturnsAsync(eId);

            // Act
            var resp = await adminController.CreateEmployee(req);

            // Assert
            Assert.That((resp?.Result as ObjectResult)?.StatusCode, Is.EqualTo(expectedCode));

            if (errMessage != null) Assert.That((resp?.Result as BadRequestObjectResult)?.Value, Is.EqualTo(errMessage));
        }
        #endregion
    }
}
