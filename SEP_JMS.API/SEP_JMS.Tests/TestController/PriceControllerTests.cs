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
using Azure.Core;

namespace SEP_JMS.Tests.TestController
{
    [TestFixture]
    public class PriceControllerTests
    {
        private readonly Mock<IPriceService> moqPriceService = new();
        private readonly Mock<IJobTypeService> moqJobTypeService = new();
        private readonly Mock<IJMSLogger> moqLogger = new();

        private PriceController priceController = null!;

        [SetUp]
        public void Setup()
        {
            priceController = new(moqPriceService.Object, moqJobTypeService.Object, moqLogger.Object);
            moqLogger.Setup(a => a.Info(It.IsAny<string>())).Verifiable();
            moqLogger.Setup(a => a.Warn(It.IsAny<string>())).Verifiable();
            moqLogger.Setup(a => a.Error(It.IsAny<string>())).Verifiable();
        }

        [TestCase]
        public async Task GetPrices_ValidRequest_ReturnValidResponse()
        {
            var id = Guid.NewGuid();
            var priceGroup = new PriceGroup();
            var lPrices = new List<Price>();

            moqPriceService.Setup(p => p.GetGroup(id)).ReturnsAsync(priceGroup);
            moqPriceService.Setup(p => p.GetPrices(id)).ReturnsAsync(lPrices);

            var response = await priceController.GetPrices(id);
            Assert.That(response.ReturnValue(), Is.Not.Null);
            Assert.That(response.ReturnValue(), Is.InstanceOf<PriceListDisplayModel>());
        }

        [TestCase]
        public async Task GetPrices_InvalidRequest_ReturnNotFound()
        {
            var id = Guid.NewGuid();
            var priceGroup = new PriceGroup();
            var lPrices = new List<Price>();

            moqPriceService.Setup(p => p.GetGroup(id)).Returns(Task.FromResult<PriceGroup>(null));
            moqPriceService.Setup(p => p.GetPrices(id)).ReturnsAsync(lPrices);

            var response = await priceController.GetPrices(id);
            Assert.That(response.StatusCode, Is.EqualTo(404));
        }

        [TestCase]
        public async Task CreateGroup_EmptyName_ReturnBadRequestWithMessage()
        {
            var req = new AddGroupPriceRequestModel();
            req.Name = "";
            req.Prices = new List<AddPriceRequestModel>();
            var gr = new PriceGroup();
            moqPriceService.Setup(p => p.AddPriceGroup(req)).ReturnsAsync(gr);
            
            var response = await priceController.CreateGroup(req);
            Assert.That(response.Result.StatusCode, Is.EqualTo(400));
            Assert.That((response.Result as BadRequestObjectResult)?.Value, Is.EqualTo("tên nhóm không được để trống"));
        }

        [TestCase]
        public async Task CreateGroup_EmptyPrices_ReturnBadRequestWithMessage()
        {
            var req = new AddGroupPriceRequestModel();
            req.Name = "ABC";
            req.Prices = new List<AddPriceRequestModel>();
            var gr = new PriceGroup();
            moqPriceService.Setup(p => p.AddPriceGroup(req)).ReturnsAsync(gr);

            var response = await priceController.CreateGroup(req);
            Assert.That((response.Result as BadRequestObjectResult)?.StatusCode, Is.EqualTo(400));
            Assert.That((response.Result as BadRequestObjectResult)?.Value, Is.EqualTo("nhóm giá trống"));
        }

        [TestCase]
        public async Task CreateGroup_ValidRequest_ReturnOk()
        {
            var req = new AddGroupPriceRequestModel();
            req.Name = "ABC";
            req.Prices = new List<AddPriceRequestModel>() { new AddPriceRequestModel()};
            var gr = new PriceGroup();
            moqPriceService.Setup(p => p.AddPriceGroup(req)).ReturnsAsync(gr);

            var response = await priceController.CreateGroup(req);
            Assert.That(response.ReturnValue(), Is.InstanceOf<PriceGroup>());
        }

    }
}
