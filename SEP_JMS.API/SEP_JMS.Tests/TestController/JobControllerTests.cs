using AutoMapper;
using Moq;
using SEP_JMS.API.Controllers;
using SEP_JMS.Common;
using SEP_JMS.Common.Logger;
using SEP_JMS.Model;
using SEP_JMS.Model.Api.Request.Job;
using SEP_JMS.Model.Api.Response;
using SEP_JMS.Model.Api.Response.Job;
using SEP_JMS.Model.Models;
using SEP_JMS.Service.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Tests.TestController
{
    [TestFixture]
    public class JobControllerTests
    {
        private readonly Mock<IJobService> mJobService = new();
        private readonly Mock<INotificationService> mNotificationService = new();
        private readonly Mock<IJMSLogger> mLogger = new();

        private JobController jobController = null!;

        [SetUp]
        public void Setup()
        {
            jobController = new(mJobService.Object, mNotificationService.Object, Global.Mapper, mLogger.Object);
            mLogger.Setup(a => a.Info(It.IsAny<string>())).Verifiable();
            mLogger.Setup(a => a.Warn(It.IsAny<string>())).Verifiable();
            mLogger.Setup(a => a.Error(It.IsAny<string>())).Verifiable();
        }

        [Test]
        public async Task GetAllProject_Authorized_ReturnValidResponse()
        {
            var usr = new User
            {
                UserId = Guid.NewGuid(),
                RoleType = Model.Enums.System.RoleType.Admin
            };
            ApiContext.SetUser(usr);
            ProjectFilterRequest model = new();
            PagingModel<JobResponse> result = new();
            mJobService.Setup(u => u.GetAllProjects(model)).ReturnsAsync(result);

            var resp = await jobController.GetAllProject(model);
            Assert.That(resp.ReturnValue(), Is.InstanceOf<PagingModel<JobResponse>>());
        }

        [Test]
        public async Task GetAllJob_Authorized_ReturnValidResponse()
        {
            var usr = new User
            {
                UserId = Guid.NewGuid(),
                RoleType = Model.Enums.System.RoleType.Admin
            };
            ApiContext.SetUser(usr);
            JobFilterRequest model = new();
            PagingModel<JobResponse> result = new();
            mJobService.Setup(u => u.GetAllJobs(model)).ReturnsAsync(result);

            var resp = await jobController.GetAllJob(model);
            Assert.That(resp.ReturnValue(), Is.InstanceOf<PagingModel<JobResponse>>());
        }

        [Test]
        public async Task GetProject_Authorized_ReturnValidResponse()
        {
            var usr = new User
            {
                UserId = Guid.NewGuid(),
                RoleType = Model.Enums.System.RoleType.Admin
            };
            ApiContext.SetUser(usr);
            var projectId = Guid.NewGuid();
            var job = new Job
            {
                JobId = projectId
            };
            mJobService.Setup(a => a.GetProject(projectId)).ReturnsAsync(new Tuple<Job, User, User, User, User, Company, JobType>(job, null!, null!, null!, null!, null!, null!));
            var response = await jobController.GetProject(projectId);
            Assert.That(response.ReturnValue(), Is.InstanceOf<JobResponse>());
            Assert.That(response.ReturnValue()?.JobId, Is.EqualTo(projectId));
        }

        [Test]
        public async Task GetProject_Authorized_ReturnNotFound()
        {
            var usr = new User
            {
                UserId = Guid.NewGuid(),
                RoleType = Model.Enums.System.RoleType.Admin
            };
            ApiContext.SetUser(usr);
            var projectId = Guid.NewGuid();
            Tuple<Job, User, User, User, User, Company, JobType> result = null!;
            mJobService.Setup(a => a.GetProject(projectId)).ReturnsAsync(result);
            var response = await jobController.GetProject(projectId);
            Assert.That(response.StatusCode(), Is.EqualTo(404));
        }

        [Test]
        public async Task GetJob_Authorized_ReturnValidResponse()
        {
            var usr = new User
            {
                UserId = Guid.NewGuid(),
                RoleType = Model.Enums.System.RoleType.Admin
            };
            ApiContext.SetUser(usr);
            var jobId = Guid.NewGuid();
            var job = new Job
            {
                JobId = jobId
            };
            mJobService.Setup(a => a.GetJob(jobId)).ReturnsAsync(new Tuple<Job, User, User, User, User, Company, JobType>(job, null!, null!, null!, null!, null!, null!));
            var response = await jobController.GetJob(jobId);
            Assert.That(response.ReturnValue(), Is.InstanceOf<JobResponse>());
            Assert.That(response.ReturnValue()?.JobId, Is.EqualTo(jobId));
        }

        [Test]
        public async Task GetJob_Authorized_ReturnNotFound()
        {
            var usr = new User
            {
                UserId = Guid.NewGuid(),
                RoleType = Model.Enums.System.RoleType.Admin
            };
            ApiContext.SetUser(usr);
            var jobId = Guid.NewGuid();
            Tuple<Job, User, User, User, User, Company, JobType> result = null!;
            mJobService.Setup(a => a.GetJob(jobId)).ReturnsAsync(result);
            var response = await jobController.GetJob(jobId);
            Assert.That(response.StatusCode(), Is.EqualTo(404));
        }

        [Test]
        public async Task CreateJob_Authorized_ReturnValidResponse()
        {
            var usr = new User
            {
                UserId = Guid.NewGuid(),
                RoleType = Model.Enums.System.RoleType.Admin
            };
            ApiContext.SetUser(usr);
            CreateJobRequest model = new()
            {
                AccountId = Guid.NewGuid(),
                CorrelationType = Model.Enums.System.CorrelationJobType.Job,
                CustomerId = Guid.NewGuid(),
                Deadline = 0L,
                Description = "description",
                DesignerId = Guid.NewGuid(),
                JobStatus = Model.Enums.System.JobStatus.NotDo,
                JobType = Guid.NewGuid(),
                ParentId = null,
                Priority = Model.Enums.System.Priority.Medium,
                Quantity = 1,
                Title = "title"
            };
            var jobId = Guid.NewGuid();
            mJobService.Setup(m => m.CreateJob(model)).ReturnsAsync(jobId);

            var resp = await jobController.CreateJob(model);
            Assert.That(resp.ReturnValue(), Is.InstanceOf<CreateJobResponse>());
            Assert.That(resp.ReturnValue()?.JobId, Is.EqualTo(jobId));
        }

        [Test]
        public async Task CreateJob_Authorized_Designer_ReturnValidResponse()
        {
            var usr = new User
            {
                UserId = Guid.NewGuid(),
                RoleType = Model.Enums.System.RoleType.Designer
            };
            ApiContext.SetUser(usr);
            CreateJobRequest model = new()
            {
                AccountId = Guid.NewGuid(),
                CorrelationType = Model.Enums.System.CorrelationJobType.Job,
                CustomerId = Guid.NewGuid(),
                Deadline = 0L,
                Description = "description",
                DesignerId = Guid.NewGuid(),
                JobStatus = Model.Enums.System.JobStatus.NotDo,
                JobType = Guid.NewGuid(),
                ParentId = null,
                Priority = Model.Enums.System.Priority.Medium,
                Quantity = 1,
                Title = "title"
            };
            var jobId = Guid.NewGuid();
            mJobService.Setup(m => m.CreateJob(model)).ReturnsAsync(jobId);

            var resp = await jobController.CreateJob(model);
            Assert.That(resp.ReturnValue(), Is.InstanceOf<CreateJobResponse>());
            Assert.That(resp.ReturnValue()?.JobId, Is.EqualTo(jobId));
        }

        [Test]
        public async Task UpdateJob_Authorized_ReturnOk()
        {
            var usr = new User
            {
                UserId = Guid.NewGuid(),
                RoleType = Model.Enums.System.RoleType.Admin
            };
            ApiContext.SetUser(usr);
            var jobId = Guid.NewGuid();
            UpdateJobRequest request = new()
            {
                CorrelationType = Model.Enums.System.CorrelationJobType.Job
            };
            var job = new Job
            {
                JobId = jobId
            };

            mJobService.Setup(a => a.GetBasicJob(jobId)).ReturnsAsync(job);
            mJobService.Setup(a => a.UpdateJob(jobId, request)).ReturnsAsync(true);
            var response = await jobController.UpdateJob(jobId, request);
            Assert.That(response.StatusCode(), Is.EqualTo(200));
        }

        [Test]
        public async Task UpdateJob_Authorized_ReturnBadRequest()
        {
            var usr = new User
            {
                UserId = Guid.NewGuid(),
                RoleType = Model.Enums.System.RoleType.Admin
            };
            ApiContext.SetUser(usr);
            var jobId = Guid.NewGuid();
            UpdateJobRequest request = new()
            {
                CorrelationType = Model.Enums.System.CorrelationJobType.Job
            };
            var job = new Job
            {
                JobId = jobId
            };

            mJobService.Setup(a => a.GetBasicJob(jobId)).ReturnsAsync(job);
            mJobService.Setup(a => a.UpdateJob(jobId, request)).ReturnsAsync(false);
            var response = await jobController.UpdateJob(jobId, request);
            Assert.That(response.StatusCode(), Is.EqualTo(400));
        }

        [Test]
        public async Task UpdateJobDesigner_Authorized_ReturnOk()
        {
            var usr = new User
            {
                UserId = Guid.NewGuid(),
                RoleType = Model.Enums.System.RoleType.Designer
            };
            ApiContext.SetUser(usr);
            Guid jobId = Guid.NewGuid();
            UpdateJobDesignerRequest model = new()
            {
                JobStatus = Model.Enums.System.JobStatus.Doing
            };
            mJobService.Setup(a => a.UpdateDesignerJob(jobId, model)).ReturnsAsync(true);
            var response = await jobController.UpdateJobDesigner(jobId, model);
            Assert.That(response.StatusCode(), Is.EqualTo(200));
        }

        [Test]
        public async Task UpdateJobDesigner_Authorized_ReturnBadRequest()
        {
            var usr = new User
            {
                UserId = Guid.NewGuid(),
                RoleType = Model.Enums.System.RoleType.Designer
            };
            ApiContext.SetUser(usr);
            Guid jobId = Guid.NewGuid();
            UpdateJobDesignerRequest model = new()
            {
                JobStatus = Model.Enums.System.JobStatus.Completed
            };
            var response = await jobController.UpdateJobDesigner(jobId, model);
            Assert.That(response.StatusCode(), Is.EqualTo(400));
        }

        
        [Test]
        public async Task Delete_Authorized_ReturnInternalServerError()
        {
            var usr = new User
            {
                UserId = Guid.NewGuid(),
                RoleType = Model.Enums.System.RoleType.Admin
            };
            Guid jobId = Guid.NewGuid();
            mJobService.Setup(a => a.Delete(jobId)).Throws(new NullReferenceException($"can't find job {jobId}"));
            var response = await jobController.Delete(jobId);
            Assert.That(response.StatusCode(), Is.EqualTo((int)HttpStatusCode.InternalServerError));
        }

        [Test]
        public async Task Delete_Authorized_ReturnOk()
        {
            var usr = new User
            {
                UserId = Guid.NewGuid(),
                RoleType = Model.Enums.System.RoleType.Admin
            };
            Guid jobId = Guid.NewGuid();
            mJobService.Setup(a => a.Delete(jobId)).Returns(Task.CompletedTask);
            var response = await jobController.Delete(jobId);
            Assert.That(response.StatusCode(), Is.EqualTo((int)HttpStatusCode.NoContent));
        }

        [Test]
        public async Task GetJobStatistics_Authorized_ReturnValidResponse()
        {
            var usr = new User
            {
                UserId = Guid.NewGuid(),
                RoleType = Model.Enums.System.RoleType.Admin
            };
            ApiContext.SetUser(usr);
            StatisticsJobRequest request = new();
            List<JobStatisticsResponse> result = new();
            mJobService.Setup(a => a.GetJobStatistics(request)).ReturnsAsync(result);
            var response = await jobController.GetJobStatistics(request);
            Assert.That(response.ReturnValue(), Is.InstanceOf<List<JobStatisticsResponse>>());
        }

        [Test]
        public async Task GetProjectDetailStatistics_Authorized_ReturnValidResponse()
        {
            var usr = new User
            {
                UserId = Guid.NewGuid(),
                RoleType = Model.Enums.System.RoleType.Admin
            };
            ApiContext.SetUser(usr);
            Guid projectId = Guid.NewGuid();
            ProjectDetailStatistics result = new();
            mJobService.Setup(a => a.GetProjectDetailStatistics(projectId)).ReturnsAsync(result);
            var response = await jobController.GetProjectDetailStatistics(projectId);
            Assert.That(response.ReturnValue(), Is.InstanceOf<ProjectDetailStatistics>());
        }

        [Test]
        public async Task Delete_Authorized_ReturnNoContent()
        {
            var usr = new User
            {
                UserId = Guid.NewGuid(),
                RoleType = Model.Enums.System.RoleType.Admin
            };
            Guid jobId = Guid.NewGuid();
            mJobService.Setup(a => a.Delete(jobId)).Returns(Task.CompletedTask);
            mNotificationService.Setup(a => a.DeleteByEntityId(jobId.ToString())).Returns(Task.CompletedTask);
            var response = await jobController.Delete(jobId);
            Assert.That(response.StatusCode(), Is.EqualTo((int)HttpStatusCode.NoContent));
        }
    }
}
