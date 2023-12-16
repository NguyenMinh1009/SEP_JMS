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
        [TestCase]
        public async Task CreateCompany_ValidRequest_ReturnValidResponse()
        {
            CompanyCreateRequestModel request = new();
            request.CompanyName = "ABC";

            var user = new User();
            moqUserService.Setup(a => a.GetUserById(request.AccountId, RoleType.Account)).ReturnsAsync(user);

            var priceGroup = new PriceGroup();
            moqPriceService.Setup(a => a.GetGroup(request.PriceGroupId)).ReturnsAsync(priceGroup);

            var company = new CompanyDisplayModel();
            moqCompanyService.Setup(a => a.CreateCompany(request)).ReturnsAsync(company);

            var response = await adminController.CreateCompany(request);
            Assert.That(response.ReturnValue(), Is.Not.Null);
            Assert.That(response.ReturnValue(), Is.InstanceOf<CompanyDisplayModel>());
        }

        [TestCase]
        public async Task CreateCompany_InvalidAccount_ReturnBadRequestWithMessage()
        {
            CompanyCreateRequestModel request = new();
            request.CompanyName = "RxZ";

            var user = new User();
            moqUserService.Setup(a => a.GetUserById(request.AccountId, RoleType.Account)).Returns(Task.FromResult<User>(null));

            var priceGroup = new PriceGroup();
            moqPriceService.Setup(a => a.GetGroup(request.PriceGroupId)).ReturnsAsync(priceGroup);

            var company = new CompanyDisplayModel();
            moqCompanyService.Setup(a => a.CreateCompany(request)).ReturnsAsync(company);

            var response = await adminController.CreateCompany(request);
            Assert.That(response.Result, Is.InstanceOf<BadRequestObjectResult>());
            Assert.That((response.Result as BadRequestObjectResult)?.Value, Is.EqualTo("không tìm thấy Account"));

        }

        [TestCase]
        public async Task CreateCompany_InvalidPriceGroup_ReturnBadRequestWithMessage()
        {
            CompanyCreateRequestModel request = new();
            request.CompanyName = "ABC";

            var user = new User();
            moqUserService.Setup(a => a.GetUserById(request.AccountId, RoleType.Account)).ReturnsAsync(user);

            var priceGroup = new PriceGroup();
            moqPriceService.Setup(a => a.GetGroup(request.PriceGroupId)).Returns(Task.FromResult<PriceGroup>(null));

            var company = new CompanyDisplayModel();
            moqCompanyService.Setup(a => a.CreateCompany(request)).ReturnsAsync(company);

            var response = await adminController.CreateCompany(request);
            Assert.That(response.Result, Is.InstanceOf<BadRequestObjectResult>());
            Assert.That((response.Result as BadRequestObjectResult)?.Value, Is.EqualTo("không tìm thấy nhóm giá"));
        }

  

        [TestCase]
        public async Task GetCompany_ValidId_ReturnValidResponse()
        {
            Guid companyId = Guid.NewGuid();
            var company = new Company
            {
                AccountId = Guid.NewGuid(),
                PriceGroupId = Guid.NewGuid()
            };
            var user = new User();
            var priceGroup = new PriceGroup();

            moqCompanyService.Setup(a => a.GetCompanyById(companyId)).ReturnsAsync(company);
            moqUserService.Setup(a => a.GetUserById(company.AccountId, RoleType.Account)).ReturnsAsync(user);
            moqPriceService.Setup(a => a.GetGroup(company.PriceGroupId)).ReturnsAsync(priceGroup);

            var response = await adminController.GetCompany(companyId);
            Assert.That(response.ReturnValue(), Is.Not.Null);
            Assert.That(response.ReturnValue(), Is.InstanceOf<CompanyDetailsDisplayModel>());
        }

        [TestCase]
        public async Task GetCompany_InvalidId_ReturnValidResponse()
        {
            Guid companyId = Guid.NewGuid();
            var company = new Company
            {
                AccountId = Guid.NewGuid(),
                PriceGroupId = Guid.NewGuid()
            };
            var user = new User();
            var priceGroup = new PriceGroup();

            moqCompanyService.Setup(a => a.GetCompanyById(companyId)).Returns(Task.FromResult<Company>(null));
            moqUserService.Setup(a => a.GetUserById(company.AccountId, RoleType.Account)).ReturnsAsync(user);
            moqPriceService.Setup(a => a.GetGroup(company.PriceGroupId)).ReturnsAsync(priceGroup);

            var response = await adminController.GetCompany(companyId);
            Assert.That(response.Result, Is.InstanceOf<NotFoundResult>());
        }

        [TestCase]
        public async Task UpdateCompany_WithValidAccount_ReturnOk()
        {
            Guid id = Guid.NewGuid();
            CompanyUpdateRequestModel request = new();

            var user = new User();
            moqUserService.Setup(a => a.GetUserById(request.AccountId, RoleType.Account)).ReturnsAsync(user);

            var priceGroup = new PriceGroup();
            moqPriceService.Setup(a => a.GetGroup(request.PriceGroupId)).ReturnsAsync(priceGroup);
            moqCompanyService.Setup(a => a.UpdateCompany(id, request)).Returns(Task.CompletedTask);

            var response = await adminController.UpdateCompany(id, request);
            Assert.That(response.StatusCode(), Is.EqualTo(200));
        }

        [TestCase]
        public async Task UpdateCompany_WithInvalidAccount_ReturnBadRequest()
        {
            Guid id = Guid.NewGuid();
            CompanyUpdateRequestModel request = new();

            var user = new User();
            moqUserService.Setup(a => a.GetUserById(request.AccountId, RoleType.Account)).Returns(Task.FromResult<User>(null));

            var priceGroup = new PriceGroup();
            moqPriceService.Setup(a => a.GetGroup(request.PriceGroupId)).ReturnsAsync(priceGroup);
            moqCompanyService.Setup(a => a.UpdateCompany(id, request)).Returns(Task.CompletedTask);

            var response = await adminController.UpdateCompany(id, request);
            Assert.That(response.StatusCode(), Is.EqualTo(400));
        }

        [Test]
        public async Task CreateEmployee_ValidRequest_ReturnValidResponse()
        {
            EmployeeCreateRequestModel request = new()
            {
                Username = "stronguser123",
                Password = "A12@!strong###"
            };
            var id = Guid.NewGuid();
            moqUserService.Setup(a => a.CreateEmployee(request)).ReturnsAsync(id);
            var response = await adminController.CreateEmployee(request);
            Assert.That(response.ReturnValue(), Is.Not.Null);
            Assert.That(response.ReturnValue(), Is.InstanceOf<UserCreateDisplayModel>());
            Assert.That(response.ReturnValue().UserId, Is.EqualTo(id));
        }

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
