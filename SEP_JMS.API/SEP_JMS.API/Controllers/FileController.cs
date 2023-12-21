using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using SEP_JMS.Common;
using SEP_JMS.Common.Constants;
using SEP_JMS.Common.Logger;
using SEP_JMS.Model.Api.Request.File;
using SEP_JMS.Model.Enums.Others;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Service.IServices;

namespace SEP_JMS.API.Controllers
{
    [Route("api/file")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly string logPrefix = "[FileController]";

        private readonly IJobService jobService;
        private readonly ICommentService commentService;
        private readonly IJMSLogger logger;

        public FileController(IJobService jobService,
            ICommentService commentService,
            IJMSLogger logger)
        {
            this.jobService = jobService;
            this.commentService = commentService;
            this.logger = logger;
        }

        [Authorize]
        [HttpPost("job/{jobId}")]
        public async Task<IActionResult> GetJobFile([FromRoute] Guid jobId, [FromBody] FileRequestModel model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to get job file of the job {jobId}.");
                var job = await jobService.GetBasicJob(jobId);
                if (job == null)
                {
                    if (ApiContext.Current.Role == RoleType.Designer)
                    {
                        var project = await jobService.GetProject(jobId);
                        if (project == null) return NotFound();
                        else job = project.Item1;
                    }
                    else return NotFound();
                }

                var basePath = AppDomain.CurrentDomain.BaseDirectory;
                switch (model.PostsType)
                {
                    case PostsType.Comment:
                        if (model.CommentId == null) return StatusCode(404);
                        var comment = await commentService.GetCommentByCorrelationJobId(jobId, model.CommentId.Value, VisibleType.Public);

                        if (comment == null) return StatusCode(404);
                        basePath = Path.Combine(basePath, ApiConstants.CommentUploadFolder, comment.CommentId.ToString());
                        break;
                    case PostsType.JobRequirement:
                        basePath = Path.Combine(basePath, ApiConstants.RequirementUploadFolder, job.JobId.ToString());
                        break;
                    case PostsType.Preview:
                        basePath = Path.Combine(basePath, ApiConstants.PreviewUploadFolder, job.JobId.ToString());
                        break;
                    case PostsType.Final:
                        basePath = Path.Combine(basePath, ApiConstants.FinalUploadFolder, job.JobId.ToString());
                        break;
                    default: return StatusCode(500);
                }
                var filePath = Path.Combine(basePath, model.FileName);
                if (!System.IO.File.Exists(filePath)) return StatusCode(404);
                _ = new FileExtensionContentTypeProvider().TryGetContentType(filePath, out string? mediaType);
                return new FileStreamResult(new FileStream(filePath, FileMode.Open), mediaType ?? "application/octet-stream");
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when getting job file of the job {jobId}. Error: {ex}");
                return StatusCode(500);
            }
        }

        [Authorize(Policy = PolicyConstants.Internal)]
        [HttpPost("internal/job/{jobId}")]
        public async Task<IActionResult> GetInternalJobFile([FromRoute] Guid jobId, [FromBody] FileRequestModel model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to get internal job file of the job {jobId}.");
                var job = await jobService.GetBasicJob(jobId);
                if (job == null)
                {
                    if (ApiContext.Current.Role == RoleType.Designer)
                    {
                        var project = await jobService.GetProject(jobId);
                        if (project == null) return NotFound();
                        else job = project.Item1;
                    }
                    else return NotFound();
                }

                var basePath = AppDomain.CurrentDomain.BaseDirectory;
                switch (model.PostsType)
                {
                    case PostsType.Comment:
                        if (model.CommentId == null) return StatusCode(404);
                        var comment = await commentService.GetCommentByCorrelationJobId(jobId, model.CommentId.Value, VisibleType.Internal);

                        if (comment == null) return StatusCode(404);
                        basePath = Path.Combine(basePath, ApiConstants.CommentUploadFolder, comment.CommentId.ToString());
                        break;
                    case PostsType.JobRequirement:
                        basePath = Path.Combine(basePath, ApiConstants.RequirementUploadFolder, job.JobId.ToString());
                        break;
                    case PostsType.Preview:
                        basePath = Path.Combine(basePath, ApiConstants.PreviewUploadFolder, job.JobId.ToString());
                        break;
                    case PostsType.Final:
                        basePath = Path.Combine(basePath, ApiConstants.FinalUploadFolder, job.JobId.ToString());
                        break;
                    default: return StatusCode(500);
                }
                var filePath = Path.Combine(basePath, model.FileName);
                if (!System.IO.File.Exists(filePath)) return StatusCode(404);

                _ = new FileExtensionContentTypeProvider().TryGetContentType(filePath, out string? mediaType);
                return new FileStreamResult(new FileStream(filePath, FileMode.Open), mediaType ?? "application/octet-stream");
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when getting internal job file of the job {jobId}. Error: {ex}");
                return StatusCode(500);
            }
        }
    }
}
