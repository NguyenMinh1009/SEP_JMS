using Moq;
using SEP_JMS.API.Controllers;
using SEP_JMS.Common.Logger;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Api.Response.Company;
using SEP_JMS.Model.Models;
using SEP_JMS.Model;
using SEP_JMS.Service.IServices;
using SEP_JMS.Service.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SEP_JMS.Model.Api.Request.User;
using SEP_JMS.Model.Api.Response;

namespace SEP_JMS.Tests.TestController
{
    [TestFixture]
    public class EmployeeControllerTests
    {
        private readonly Mock<IUserService> mUserService = new();
        private readonly Mock<IJMSLogger> mLogger = new();

        private EmployeeController employeeController = null!;

        [SetUp]
        public void Setup()
        {
            employeeController = new(mUserService.Object, mLogger.Object);
            mLogger.Setup(a => a.Info(It.IsAny<string>())).Verifiable();
            mLogger.Setup(a => a.Warn(It.IsAny<string>())).Verifiable();
            mLogger.Setup(a => a.Error(It.IsAny<string>())).Verifiable();
        }

        [Test]
        public async Task FindDesigners_ReturnValidResponse()
        {
            var req = new UserFilterRequest();
            PagingModel<EmployeeBasicDisplayModel> rest = new PagingModel<EmployeeBasicDisplayModel>();
            mUserService.Setup(u => u.FindDesigners(req)).ReturnsAsync(rest);
            var resp = await employeeController.FindDesigners(req);
            Assert.That(resp.ReturnValue(), Is.InstanceOf<PagingModel<EmployeeBasicDisplayModel>>());
        }

        [Test]
        public async Task FindAccount_ReturnValidResponse()
        {
            var req = new UserFilterRequest();
            PagingModel<EmployeeBasicDisplayModel> rest = new PagingModel<EmployeeBasicDisplayModel>();
            mUserService.Setup(u => u.FindAccounts(req)).ReturnsAsync(rest);
            var resp = await employeeController.FindAccounts(req);
            Assert.That(resp.ReturnValue(), Is.InstanceOf<PagingModel<EmployeeBasicDisplayModel>>());
        }
    }
}
