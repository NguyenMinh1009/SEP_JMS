using AutoMapper;
using Microsoft.Extensions.Configuration;
using Moq;
using SEP_JMS.API.Controllers;
using SEP_JMS.Common.Logger;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Api.Response;
using SEP_JMS.Model.Models;
using SEP_JMS.Model;
using SEP_JMS.Service.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SEP_JMS.Model.Api.Request.User;
using SEP_JMS.Model.Api.Response.User;
using Microsoft.AspNetCore.Http;
using SEP_JMS.Common;
using System.Reflection;
using Microsoft.AspNetCore.Mvc;
using SEP_JMS.Model.Enums.System;

namespace SEP_JMS.Tests.TestController
{
    [TestFixture]
    public class UserControllerTests
    {
        private readonly Mock<IUserService> moqUserService = new();
        private readonly Mock<ICompanyService> moqCompanyService = new();
        private readonly Mock<IJMSLogger> moqLogger = new();
        private readonly Mock<IConfiguration> moqConfiguration = new();

        private UserController userController = null!;

        [SetUp]
        public void Setup()
        {
            var httpContext = new DefaultHttpContext();
            userController = new(moqUserService.Object, moqCompanyService.Object, Global.Mapper, moqConfiguration.Object, moqLogger.Object);
            moqLogger.Setup(a => a.Info(It.IsAny<string>())).Verifiable();
            moqLogger.Setup(a => a.Warn(It.IsAny<string>())).Verifiable();
            moqLogger.Setup(a => a.Error(It.IsAny<string>())).Verifiable();
        }

        [Test]
        public async Task GetUserById_Authorized_ReturnValidResponse()
        {
            var usr = new User();
            usr.UserId = Guid.Parse("d2b13bac-02df-498c-a9fb-1f99dd162304");
            usr.RoleType = Model.Enums.System.RoleType.Admin;
            ApiContext.SetUser(usr);

            moqUserService.Setup(u => u.GetUserByIdWithoutRole(usr.UserId)).ReturnsAsync(usr);

            var resp = await userController.GetUserById();
            Assert.That(resp.ReturnValue(), Is.InstanceOf<UserDetailsDisplayModel>());
        }

        [Test]
        public async Task GetUserById_UnAuthorized_ReturnNotFound()
        {
            var usr = new User();
            usr.UserId = Guid.NewGuid();
            usr.RoleType = Model.Enums.System.RoleType.Admin;
            ApiContext.Empty();

            moqUserService.Setup(u => u.GetUserByIdWithoutRole(usr.UserId)).ReturnsAsync(usr);

            var resp = await userController.GetUserById();
            Assert.That(resp.Result, Is.InstanceOf<NotFoundResult>());
        }

        [TestCase("", "+84358329848", 0, 400, "Full name is invalid")]
        [TestCase("ABC", "12345678", 0, 400, "Phone number is invalid")]
        [TestCase("ABC", "+84358329848", 0, 400, "Date of birth is invalid")]
        [TestCase("ABC", "+84358329848", 638375526555475768, 200, null)]
        public async Task UpdateProfile_ValidRequest_ReturnValidResponse(string fullName, string? phone, long? dob, int expectedCode, string? errMessage)
        {
            var req = new UpdateProfileRequest();
            req.Fullname = fullName;
            req.DOB = dob;
            req.Phone = phone;
            var usr = new User();

            moqUserService.Setup(u => u.UpdateProfile(req)).ReturnsAsync(usr);

            var resp = await userController.UpdateProfile(req);

            // Assert
            Assert.That(resp.StatusCode, Is.EqualTo(expectedCode));
            if (expectedCode == 400) Assert.That((resp as BadRequestObjectResult)?.Value, Is.EqualTo(errMessage));
        }

        [TestCase("12345678", 400)]
        [TestCase("12345678@Abc", 200)]
        [TestCase(null, 500)]
        public async Task ChangePassword_ValidatePassword_ReturnValidResponse(string password, int expectedCode)
        {
            // Arrange
            var req = new ChangePasswordRequest();
            req.UserName = "test";
            req.OldPassword = "test";
            req.NewPassword = password;
            moqUserService.Setup(u => u.ChangePassword(req)).ReturnsAsync(1);

            // Act
            var resp = await userController.ChangePassword(req);

            // Assert
            Assert.That(resp.StatusCode, Is.EqualTo(expectedCode));
            if (expectedCode == 400) Assert.That((resp as BadRequestObjectResult)?.Value, Is.EqualTo("New password is invalid format"));
        }

        [Test]
        public async Task FindDesigners_ExceptCustomerRole_ReturnValidResponse()
        {
            // Arrange
            var req = new UserFilterRequest();
            req.Role = RoleType.Admin;
            var rest = new PagingModel<User>();
            moqUserService.Setup(u => u.GetUsers(req)).ReturnsAsync(rest);

            // Act
            var resp = await userController.FindDesigners(req);

            // Assert
            Assert.That(resp.ReturnValue(), Is.InstanceOf<PagingModel<UserResponse>>());
        }

        [Test]
        public async Task FindDesigners_WithCustomerRole_ReturnForbiden()
        {
            // Arrange
            var req = new UserFilterRequest();
            req.Role = RoleType.Customer;
            var rest = new PagingModel<User>();
            moqUserService.Setup(u => u.GetUsers(req)).ReturnsAsync(rest);
            ApiContext.SetUser(new User { RoleType=RoleType.Customer});

            // Act
            var resp = await userController.FindDesigners(req);

            // Assert
            Assert.That(resp.Result, Is.InstanceOf<ForbidResult>());
        }

    }
}
