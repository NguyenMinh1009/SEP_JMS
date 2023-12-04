using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SEP_JMS.Common.Constants;
using SEP_JMS.Common;
using SEP_JMS.Model.Api.Request.Comment;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Service.IServices;
using SEP_JMS.Common.Logger;
using SEP_JMS.Model.Api.Response.Comment;
using SEP_JMS.Model;
using Newtonsoft.Json;
using SEP_JMS.Common.Utils;
using SEP_JMS.Model.Models.ExtensionModels;
using AutoMapper;
using System.Security.Cryptography.Pkcs;

namespace SEP_JMS.API.Controllers
{
    [Route("api/comment")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly string logPrefix = "[CommentController]";
        private readonly ICommentService commentService;
        private readonly INotificationService notificationService;
        private readonly IJMSLogger logger;
        private readonly IMapper mapper;

        public CommentController(ICommentService commentService,
            IJMSLogger logger,
            IMapper mapper,
            INotificationService notificationService)
        {
            this.commentService = commentService;
            this.logger = logger;
            this.mapper = mapper;
            this.notificationService = notificationService;
        }
        [Authorize]
        [RequestSizeLimit(PolicyConstants.commentFileSize)]
        [RequestFormLimits(MultipartBodyLengthLimit = PolicyConstants.commentFileSize)]
        [HttpPost("{jobId}")]
        public async Task<IActionResult> CreateComment([FromRoute] Guid jobId, [FromForm] CommentCreateRequestModel model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to post comment for the job {jobId}.");
                if (ApiContext.Current.Role == RoleType.Customer && model.VisibleType == VisibleType.Internal) return StatusCode(403);
                var success = await commentService.CreateComment(jobId, model);
                if (success) { await notificationService.Trigger(jobId, null, model.Content, NotiAction.Comment); }
                return success ? Ok() : BadRequest();
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when posting a comment for the job {jobId}. Error: {ex}");
                return StatusCode(500);
            }
        }
        [Authorize]
        [HttpPost("all")]
        public async Task<ActionResult<PagingModel<CommentDetailsDisplayModel>>> GetComments([FromBody] CommentFilterRequestModel model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to post comment for the job {model.JobId}.");
                if (ApiContext.Current.Role == RoleType.Customer && model.VisibleType == VisibleType.Internal) return StatusCode(403);
                var comments = await commentService.GetComments(model);
                if (comments == null) return StatusCode(404);
                return comments;
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when posting a comment for the job {model.JobId}. Error: {ex}");
                return StatusCode(500);
            }
        }
        [Authorize]
        [HttpPost("{commentId}/hide")]
        public async Task<IActionResult> HideComments([FromRoute] Guid commentId)
        {
            try
            {
                logger.Info($"{logPrefix} Start to hide comment {commentId}.");
                await commentService.HideComment(commentId, CommentStatus.Invisible);
                return Ok();
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when hidding comment {commentId}. Error: {ex}");
                return StatusCode(500);
            }
        }

        [Authorize]
        [HttpPut("{commentId}")]
        public async Task<IActionResult> UpdateComment([FromRoute] Guid commentId, [FromForm] CommentUpdateRequestModel model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to update comment {commentId}.");
                var comment = await commentService.GetComment(commentId) ?? throw new Exception($"Not found comment {commentId}");
                if (comment.UserId != ApiContext.Current.UserId) throw new Exception($"User is not the owner of the comment {commentId}");

                var keepingFiles = JsonConvert.DeserializeObject<List<FileItem>>(model.OldFiles) ?? new();
                var jobFolderPath = FileUtility.GetFolderPath(ApiConstants.CommentUploadFolder, commentId.ToString());
                FileUtility.RemoveOldFiles(jobFolderPath, keepingFiles);
                var folderModel = new FolderItem
                {
                    Folder = commentId.ToString(),
                    Files = keepingFiles
                };
                foreach (var file in model.Files)
                {
                    var fileModel = await FileUtility.SaveFile(ApiConstants.CommentUploadFolder, commentId.ToString(), file);
                    folderModel.Files.Add(fileModel);
                }
                comment.Content = model.Content;
                comment.Attachments = JsonConvert.SerializeObject(folderModel);
                var count = await commentService.UpdateComment(comment);
                if (count < 1) throw new Exception("Update comment failed: 0 rows effected");
                return Ok(mapper.Map<CommentDetailsDisplayModel>(await commentService.GetComment(commentId)));
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when updating comment {commentId}. Error: {ex}");
                return StatusCode(500);
            }
        }
    }
}
