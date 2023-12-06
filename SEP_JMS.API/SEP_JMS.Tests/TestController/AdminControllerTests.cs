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

namespace SEP_JMS.Tests.TestController
{
    [TestFixture]
    public class AdminControllerTests
    {
        private readonly Mock<ICompanyService> moqCompanyService = new();
        private readonly Mock<IUserService> moqUserService = new();
        private readonly Mock<IPriceService> moqPriceService = new();
        private readonly Mock<IConfiguration> moqConfiguration = new();
        private readonly Mock<IMapper> moqMapper = new();
        private readonly Mock<IJMSLogger> moqLogger = new();

        private AdminController adminController = null!;

        [SetUp]
        public void Setup()
        {
            adminController = new(moqCompanyService.Object, moqUserService.Object, moqPriceService.Object, moqConfiguration.Object, moqMapper.Object, moqLogger.Object);
            moqLogger.Setup(a => a.Info(It.IsAny<string>())).Verifiable();
            moqLogger.Setup(a => a.Warn(It.IsAny<string>())).Verifiable();
            moqLogger.Setup(a => a.Error(It.IsAny<string>())).Verifiable();
        }

        [TestCase]
        public async Task GetAllCompanies_ShouldReturnValidResponse()
        {
            CompanyAdminFilterRequestModel request = new();
            PagingModel<Tuple<Company, User, PriceGroup>> result = new();
            moqCompanyService.Setup(a => a.GetCompanies(request)).ReturnsAsync(result);
            var response = await adminController.GetAllCompanies(request);
            Assert.That(response.ReturnValue(), Is.Not.Null);
            Assert.That(response.ReturnValue(), Is.InstanceOf<PagingModel<CompanyDetailsDisplayModel>>());
        }

        [TestCase]
        public async Task GetCompany_ShouldReturnValidResponse()
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
        public async Task DeleteCompany_ShouldReturnOk()
        {
            Guid companyId = Guid.NewGuid();
            moqCompanyService.Setup(a => a.DeleteCompany(companyId)).Returns(Task.CompletedTask);
            var response = await adminController.DeleteCompany(companyId);
            Assert.That(response.StatusCode(), Is.EqualTo(200));
        }

        [TestCase]
        public async Task CreateCompany_ShouldReturnValidResponse()
        {
            CompanyCreateRequestModel request = new();

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
        public async Task UpdateCompany_ShouldReturnOk()
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
        public async Task CreateEmployee_ShouldReturnValidResponse()
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
    }
}
