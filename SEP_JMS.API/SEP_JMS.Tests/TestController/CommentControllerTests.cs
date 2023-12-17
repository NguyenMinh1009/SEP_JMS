using Moq;
using SEP_JMS.API.Controllers;
using SEP_JMS.Common;
using SEP_JMS.Common.Logger;
using SEP_JMS.Model.Api.Request.User;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Model.Models;
using SEP_JMS.Model;
using SEP_JMS.Service.IServices;
using SEP_JMS.Model.Api.Request.Comment;
using SEP_JMS.Model.Api.Response.Comment;
using SEP_JMS.Model.Api.Response;
using Microsoft.AspNetCore.Mvc;
using SEP_JMS.Model.Api.Response.User;

namespace SEP_JMS.Tests.TestController
{
    [TestFixture]
    public class CommentControllerTests
    {
        private readonly Mock<ICommentService> mCommentService = new();
        private readonly Mock<INotificationService> mNotificationService = new();
        private readonly Mock<IJMSLogger> mLogger = new();

        private CommentController commentController = null!;

        [SetUp]
        public void Setup()
        {
            commentController = new(mCommentService.Object, mLogger.Object, Global.Mapper, mNotificationService.Object);
            mLogger.Setup(a => a.Info(It.IsAny<string>())).Verifiable();
            mLogger.Setup(a => a.Warn(It.IsAny<string>())).Verifiable();
            mLogger.Setup(a => a.Error(It.IsAny<string>())).Verifiable();
        }

        [Test]
        public async Task GetComment_WithJobId_ReturnNotFound()
        {
            var req = new CommentFilterRequestModel();
            req.JobId = new Guid();
            PagingModel<CommentDetailsDisplayModel> rest = null!;
            mCommentService.Setup(u => u.GetComments(req)).ReturnsAsync(rest);
            ApiContext.SetUser(new User { RoleType = RoleType.Admin });
            var resp = await commentController.GetComments(req);
            Assert.That(resp.StatusCode(), Is.EqualTo(404));
        }
        [Test]
        public async Task GetComment_WithJobId_ReturnValidResponse()
        {
            ApiContext.SetUser(new User { RoleType = RoleType.Admin });
            var job = new Job();
            job.JobId = Guid.NewGuid();
            var req = new CommentFilterRequestModel();
            req.JobId = job.JobId;
            PagingModel<CommentDetailsDisplayModel> rest = new PagingModel<CommentDetailsDisplayModel>();
            mCommentService.Setup(m => m.GetComments(req)).ReturnsAsync(rest);
            var resp = await commentController.GetComments(req);
            Assert.That(resp.ReturnValue(), Is.InstanceOf<PagingModel<CommentDetailsDisplayModel>>());
        }

        [Test]
        public async Task CreateComment_WithCustomerAndInternalJob_ReturnForbiden()
        {
            ApiContext.SetUser(new User { RoleType = RoleType.Customer });
            var job = new Job();
            job.JobId = Guid.NewGuid();
            var req = new CommentCreateRequestModel();
            req.VisibleType = VisibleType.Internal;
            mCommentService.Setup(m => m.CreateComment(job.JobId, req)).ReturnsAsync(true);
            var resp = await commentController.CreateComment(job.JobId, req);
            Assert.That(resp.StatusCode(), Is.EqualTo(403));
        }

        [Test]
        public async Task CreateComment_WithCustomerAndPublicJob_ReturnOK()
        {
            ApiContext.SetUser(new User { RoleType = RoleType.Customer });
            var job = new Job();
            job.JobId = Guid.NewGuid();
            var req = new CommentCreateRequestModel();
            req.VisibleType = VisibleType.Public;
            mCommentService.Setup(m => m.CreateComment(job.JobId, req)).ReturnsAsync(true);
            var resp = await commentController.CreateComment(job.JobId, req);
            Assert.That(resp.StatusCode(), Is.EqualTo(200));
        }

        [Test]
        public async Task CreateComment_WithAdminAndInternalJob_ReturnOk()
        {
            ApiContext.SetUser(new User { RoleType = RoleType.Admin });
            var job = new Job();
            job.JobId = Guid.NewGuid();
            var req = new CommentCreateRequestModel();
            req.VisibleType = VisibleType.Internal;
            mCommentService.Setup(m => m.CreateComment(job.JobId, req)).ReturnsAsync(true);
            var resp = await commentController.CreateComment(job.JobId, req);
            Assert.That(resp.StatusCode(), Is.EqualTo(200));
        }

        [Test]
        public async Task UpdateComment_CommentNotFound_ReturnInternalServerError()
        {
            ApiContext.SetUser(new User { RoleType = RoleType.Admin });
            var commentId = Guid.NewGuid();
            var req = new CommentUpdateRequestModel();
            Comment commentRq = null!;
            mCommentService.Setup(m => m.GetComment(commentId)).ReturnsAsync(commentRq);
            var resp = await commentController.UpdateComment(commentId, req);
            Assert.That(resp.StatusCode(), Is.EqualTo(500));
        }

        [Test]
        public async Task UpdateComment_UserIsNotOwner_ReturnInternalServerError()
        {
            ApiContext.SetUser(new User { RoleType = RoleType.Admin });
            ApiContext.SetUser(new User { UserId = Guid.NewGuid() });
            var commentId = Guid.NewGuid();
            var req = new CommentUpdateRequestModel();
            Comment commentRq = new Comment();
            var comment = mCommentService.Setup(m => m.GetComment(commentId)).ReturnsAsync(commentRq);
            var resp = await commentController.UpdateComment(commentId, req);
            Assert.That(resp.StatusCode(), Is.EqualTo(500));
        }

        [Test]
        public async Task UpdateComment_UserIsOwner_ReturnOk()
        {
            ApiContext.SetUser(new User { RoleType = RoleType.Admin });
            ApiContext.SetUser(new User { UserId = Guid.NewGuid() });
            var commentId = Guid.NewGuid();
            var req = new CommentUpdateRequestModel();
            Comment commentRq = new Comment();
            commentRq.UserId = ApiContext.Current.UserId;
            var comment =  mCommentService.Setup(m => m.GetComment(commentId)).ReturnsAsync(commentRq);
            var commentsUpdated =  mCommentService.Setup(m => m.UpdateComment(commentRq)).ReturnsAsync(1);
            var resp = await commentController.UpdateComment(commentId, req);
            Assert.That(resp.StatusCode(), Is.EqualTo(200));
        }
    }
}
