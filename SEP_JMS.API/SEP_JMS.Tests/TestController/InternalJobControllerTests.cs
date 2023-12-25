using Moq;
using SEP_JMS.API.Controllers;
using SEP_JMS.Common.Logger;
using SEP_JMS.Model;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Api.Request.InternalJob;
using SEP_JMS.Model.Api.Response;
using SEP_JMS.Service.IServices;

namespace SEP_JMS.Tests.TestController
{
    [TestFixture]
    public class InternalJobControllerTests
    {
        private readonly Mock<IInternalJobService> mInternalJobService = new();
        private readonly Mock<IJobService> mJobService = new();
        private readonly Mock<INotificationService> mNotificationService = new();
        private readonly Mock<IJMSLogger> mLogger = new();

        private InternalJobController internalJobController = null!;

        [SetUp]
        public void Setup()
        {
            internalJobController = new(mInternalJobService.Object, mJobService.Object, mNotificationService.Object, mLogger.Object);
            mLogger.Setup(a => a.Info(It.IsAny<string>())).Verifiable();
            mLogger.Setup(a => a.Warn(It.IsAny<string>())).Verifiable();
            mLogger.Setup(a => a.Error(It.IsAny<string>())).Verifiable();
        }

        [Test]
        public async Task GetAll_Authorized_ReturnValidResponse()
        {
            var request = new InternalJobFilterRequestModel();
            mInternalJobService.Setup(a => a.GetAllInternalJobs(request)).ReturnsAsync(new PagingModel<InternalJobDetailsDisplayModel>());
            var response = await internalJobController.GetAll(request);
            Assert.That(response.ReturnValue(), Is.InstanceOf<PagingModel<InternalJobDetailsDisplayModel>>());
        }

        [Test]
        public async Task GetInternalJob_Authorized_ReturnValidResponse()
        {
            InternalJobDetailsDisplayModel result = new();
            var jobId = Guid.NewGuid();
            mInternalJobService.Setup(a => a.GetInternalJob(jobId)).ReturnsAsync(result);
            var response = await internalJobController.GetInternalJob(jobId);
            Assert.That(response.ReturnValue(), Is.InstanceOf<InternalJobDetailsDisplayModel>());
        }

        [Test]
        public async Task GetInternalJob_Authorized_ReturnNotFound()
        {
            InternalJobDetailsDisplayModel result = null!;
            var jobId = Guid.NewGuid();
            mInternalJobService.Setup(a => a.GetInternalJob(jobId)).ReturnsAsync(result);
            var response = await internalJobController.GetInternalJob(jobId);
            Assert.That(response.StatusCode(), Is.EqualTo(404));
        }

        [Test]
        public async Task UpdateInternalJobStatus_Authorized_ReturnOk()
        {
            var jobId = Guid.NewGuid();
            InternalJobStatusUpdateRequestModel request = new();
            mInternalJobService.Setup(a => a.UpdateInternalJobStatus(jobId, request.InternalJobStatus)).ReturnsAsync(true);
            var response = await internalJobController.UpdateInternalJobStatus(jobId, request);
            Assert.That(response.StatusCode(), Is.EqualTo(200));
        }

        [Test]
        public async Task UpdateInternalJobStatus_Authorized_ReturnBadRequest()
        {
            var jobId = Guid.NewGuid();
            InternalJobStatusUpdateRequestModel request = new();
            var response = await internalJobController.UpdateInternalJobStatus(jobId, request);
            Assert.That(response.StatusCode(), Is.EqualTo(400));
        }
    }
}
