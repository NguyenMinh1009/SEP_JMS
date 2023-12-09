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
using SEP_JMS.Model.Api.Response;
using SEP_JMS.Common;
using SEP_JMS.Model.Enums.System;

namespace SEP_JMS.Tests.TestController
{
    [TestFixture]
    public class CustomerControllerTests
    {
        private readonly Mock<IUserService> mUserService = new();
        private readonly Mock<IJMSLogger> mLogger = new();

        private CustomerController customerController = null!;
        [SetUp]
        public void Setup()
        {
            customerController = new(mUserService.Object, Global.Mapper, mLogger.Object);
            mLogger.Setup(a => a.Info(It.IsAny<string>())).Verifiable();
            mLogger.Setup(a => a.Warn(It.IsAny<string>())).Verifiable();
            mLogger.Setup(a => a.Error(It.IsAny<string>())).Verifiable();
        }
        
        [Test]
        public async Task GetCustomers_ReturnValidResponse()
        {
            var req = new CustomerFilterRequestModel();
            PagingModel<CustomerFindDisplayModel> rest = new PagingModel<CustomerFindDisplayModel>();
            mUserService.Setup(u => u.FindCustomers(req)).ReturnsAsync(rest);
            var resp = await customerController.GetCustomers(req);
            Assert.That(resp.ReturnValue(), Is.InstanceOf<PagingModel<CustomerFindDisplayModel>>());
        }

        [Test]
        public async Task GetPricePermission_ReturnOk()
        {
            ApiContext.SetUser(new User { UserId = Guid.NewGuid() });
            var req = new CustomerFilterRequestModel();
            User user = new User();
            mUserService.Setup(u => u.GetUserById(ApiContext.Current.UserId, RoleType.Customer)).ReturnsAsync(user);
            var resp = await customerController.GetPricePermission();
            Assert.That(resp.StatusCode(), Is.EqualTo(200));
        }

        [Test]
        public async Task GetPricePermission_ReturnNotFound()
        {
            ApiContext.SetUser(new User { UserId = Guid.NewGuid() });
            var req = new CustomerFilterRequestModel();
            User user = null!;
            mUserService.Setup(u => u.GetUserById(ApiContext.Current.UserId, RoleType.Customer)).ReturnsAsync(user);
            var resp = await customerController.GetPricePermission();
            Assert.That(resp.StatusCode(), Is.EqualTo(404));
        }

        [Test]
        public async Task GetRelatedCustomer_ReturnValidResponse()
        {
            var req = new CustomerFilterRequestModel();
            PagingModel<User> rest = new PagingModel<User>();
            mUserService.Setup(u => u.GetCustomerForFilterJobInternalRole(req)).ReturnsAsync(rest);
            var resp = await customerController.GetRelatedCustomer(req);
            Assert.That(resp.ReturnValue(), Is.InstanceOf<PagingModel<CustomerFindDisplayModel>>());
        }
    }
}
