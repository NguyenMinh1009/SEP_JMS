
using Moq;
using SEP_JMS.API.Controllers;
using SEP_JMS.Common;
using SEP_JMS.Common.Logger;
using SEP_JMS.Model.Api.Request.Comment;
using SEP_JMS.Model.Api.Response.Comment;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Model.Models;
using SEP_JMS.Model;
using SEP_JMS.Service.IServices;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Api.Response.Company;
using SEP_JMS.Model.Api.Response.User;
using Microsoft.AspNetCore.Mvc;
using SEP_JMS.Model.Api.Response;

namespace SEP_JMS.Tests.TestController
{
    [TestFixture]
    public class CompanyControllerTests
    {
        private readonly Mock<ICompanyService> mCompanyService = new();
        private readonly Mock<IJMSLogger> mLogger = new();

        private CompanyController companyController = null!;

        [SetUp]
        public void Setup()
        {
            companyController = new(mCompanyService.Object, Global.Mapper, mLogger.Object);
            mLogger.Setup(a => a.Info(It.IsAny<string>())).Verifiable();
            mLogger.Setup(a => a.Warn(It.IsAny<string>())).Verifiable();
            mLogger.Setup(a => a.Error(It.IsAny<string>())).Verifiable();
        }

        [Test]
        public async Task GetRelatedCompany_ReturnValidResponse()
        {
            var req = new BaseFilterRequest();
            PagingModel<Company> rest = new PagingModel<Company>();
            mCompanyService.Setup(u => u.GetCompanyForFilterJobAccountAndDesigner(req)).ReturnsAsync(rest);
            var resp = await companyController.GetRelatedCompany(req);
            Assert.That(resp.ReturnValue(), Is.InstanceOf<PagingModel<CompanyDisplayModel>>());
        }

        [Test]
        public async Task FindCompany_ReturnValidResponse()
        {
            var req = new CompanyFilterRequest();
            PagingModel<Company> rest = new PagingModel<Company>();
            mCompanyService.Setup(u => u.GetCompanies(req, true)).ReturnsAsync(rest);
            var resp = await companyController.FindCompany(req);
            Assert.That(resp.ReturnValue(), Is.InstanceOf<PagingModel<CompanyResponse>>());
        }

    }
}
