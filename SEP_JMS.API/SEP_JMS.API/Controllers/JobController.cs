using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Newtonsoft.Json;
using SEP_JMS.Common.Constants;
using SEP_JMS.Common;
using SEP_JMS.Common.Logger;
using SEP_JMS.Common.Utils;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Model.Models.ExtensionModels;
using SEP_JMS.Model;
using SEP_JMS.Service.IServices;
using System.Net;
using SEP_JMS.Model.Api.Response.Job;
using SEP_JMS.Model.Api.Request.Job;
using SEP_JMS.Model.Api.Response.User;
using SEP_JMS.Model.Api.Response.Company;
using SEP_JMS.Model.Api.Response.JobType;
using SEP_JMS.Model.Api.Request.File;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Api.Response;
using SEP_JMS.Model.Models;
using SEP_JMS.Common.Converters;

namespace SEP_JMS.API.Controllers
{
    [Route("api/job")]
    [ApiController]
    public class JobController : ControllerBase
    {
        private readonly string logPrefix = "[JobController]";

        private readonly IJobService jobService;
        private readonly IInternalJobService internalJobService;
        private readonly INotificationService notificationService;
        private readonly IMapper mapper;
        private readonly IJMSLogger logger;

        public JobController(IJobService jobService,
            INotificationService notificationService,
            IInternalJobService internalJobService,
            IMapper mapper,
            IJMSLogger logger)
        {
            this.jobService = jobService;
            this.mapper = mapper;
            this.logger = logger;
            this.internalJobService = internalJobService;
            this.notificationService = notificationService;
        }

        [Authorize]
        [HttpPost("allprojects")]
        public async Task<ActionResult<PagingModel<JobResponse>>> GetAllProject([FromBody] ProjectFilterRequest model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to get all projects.");
                return await jobService.GetAllProjects(model);
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when getting all projects. Error: {ex}");
                return StatusCode(500);
            }
        }

        [Authorize]
        [HttpPost("all")]
        public async Task<ActionResult<PagingModel<JobResponse>>> GetAllJob([FromBody] JobFilterRequest model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to get all jobs.");
                return await jobService.GetAllJobs(model);
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when getting all jobs. Error: {ex}");
                return StatusCode(500);
            }
        }

        [Authorize(Policy = PolicyConstants.CreateJob)]
        [RequestSizeLimit(PolicyConstants.requirementFileSize)]
        [RequestFormLimits(MultipartBodyLengthLimit = PolicyConstants.requirementFileSize)]
        [HttpPost]
        public async Task<ActionResult<CreateJobResponse>> CreateJob([FromForm] CreateJobRequest model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to create a new job for customer {model.CustomerId} account {model.AccountId}");
                if (ApiContext.Current.UserId != model.CustomerId && ApiContext.Current.Role == RoleType.Customer)
                    return StatusCode((int)HttpStatusCode.Forbidden);
                if (ApiContext.Current.Role == RoleType.Customer || model.CorrelationType == CorrelationJobType.Project) model.DesignerId = null;
                var jobId = await jobService.CreateJob(model);
                if (jobId == null) return StatusCode((int)HttpStatusCode.InternalServerError);

                // create notification
                await notificationService.Trigger(jobId.Value, null, null, NotiAction.CreateJob);
                return new CreateJobResponse { JobId = jobId.Value };
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when creating a new job for customer {model.CustomerId} account {model.AccountId}. Error: {ex}");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
        }

        [Authorize]
        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<JobResponse>> GetProject([FromRoute] Guid projectId)
        {
            try
            {
                logger.Info($"{logPrefix} Start to get the project {projectId}.");
                var job = await jobService.GetProject(projectId);
                if (job == null) return StatusCode((int)HttpStatusCode.NotFound);

                var jobDisplay = mapper.Map<JobResponse>(job.Item1);
                jobDisplay.CreatedBy = mapper.Map<UserResponse>(job.Item2);
                jobDisplay.Customer = mapper.Map<CustomerResponse>(job.Item3);
                jobDisplay.Account = mapper.Map<EmployeeResponse>(job.Item4);
                jobDisplay.Designer = mapper.Map<EmployeeResponse>(job.Item5);
                jobDisplay.Company = mapper.Map<CompanyResponse>(job.Item6);
                jobDisplay.JobType = mapper.Map<JobTypeResponse>(job.Item7);
                if (ApiContext.Current.Role == RoleType.Customer && (jobDisplay.JobStatus != JobStatus.CustomerReview || jobDisplay.JobStatus != JobStatus.Completed))
                {
                    jobDisplay.FinalProducts = null;
                    jobDisplay.PreviewProducts = null;
                }
                return jobDisplay;
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when getting the project {projectId}. Error: {ex}");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
        }

        [Authorize]
        [HttpGet("{jobId}")]
        public async Task<ActionResult<JobResponse>> GetJob([FromRoute] Guid jobId)
        {
            try
            {
                logger.Info($"{logPrefix} Start to get the job {jobId}.");
                var job = await jobService.GetJob(jobId);
                if (job == null) return StatusCode((int)HttpStatusCode.NotFound);

                var jobDisplay = mapper.Map<JobResponse>(job.Item1);
                jobDisplay.CreatedBy = mapper.Map<UserResponse>(job.Item2);
                jobDisplay.Customer = mapper.Map<CustomerResponse>(job.Item3);
                jobDisplay.Account = mapper.Map<EmployeeResponse>(job.Item4);
                jobDisplay.Designer = mapper.Map<EmployeeResponse>(job.Item5);
                jobDisplay.Company = mapper.Map<CompanyResponse>(job.Item6);
                jobDisplay.JobType = mapper.Map<JobTypeResponse>(job.Item7);
                if (ApiContext.Current.Role == RoleType.Customer && (jobDisplay.JobStatus != JobStatus.CustomerReview || jobDisplay.JobStatus != JobStatus.Completed))
                {
                    jobDisplay.FinalProducts = null;
                    jobDisplay.PreviewProducts = null;
                }
                return jobDisplay;
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when getting the job {jobId}. Error: {ex}");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
        }

        [Authorize(Roles = PolicyConstants.Designer)]
        [HttpPut("designer/{jobId}")]
        public async Task<IActionResult> UpdateJobDesigner([FromRoute] Guid jobId, [FromBody] UpdateJobDesignerRequest model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to update the job designer {jobId}.");
                if (model.JobStatus == JobStatus.Pending || model.JobStatus == JobStatus.Completed) return BadRequest();

                var job = await jobService.GetBasicJob(jobId);
                if (job == null) return NotFound();
                if (job.JobStatus == JobStatus.Pending || job.JobStatus == JobStatus.Completed) return Forbid();
                if (job.PaymentSuccess) return Forbid();

                var success = await jobService.UpdateDesignerJob(jobId, model);
                return success ? Ok() : BadRequest();
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when updating the job designer {jobId}. Error: {ex}");
                return StatusCode(500);
            }
        }

        [Authorize(Policy = PolicyConstants.CreateJob)]
        [HttpPut("{jobId}")]
        public async Task<IActionResult> UpdateJob([FromRoute] Guid jobId, [FromBody] UpdateJobRequest model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to update the job {jobId}.");
                if (model.CorrelationType == CorrelationJobType.Project && model.ParentId != null) throw new ArgumentException("project can't have parent id");

                // for make notify
                var job = await jobService.GetBasicJob(jobId);
                if (job == null) return NotFound();
                if (job.JobStatus == JobStatus.Completed && ApiContext.Current.Role != RoleType.Admin) return Forbid();
                if (job.PaymentSuccess) return Forbid();

                if (ApiContext.Current.Role == RoleType.Customer || model.CorrelationType == CorrelationJobType.Project)
                {
                    model.DesignerId = null;
                    model.AccountId = null;
                }
                if (model.JobStatus == JobStatus.Completed && model.CorrelationType == CorrelationJobType.Project)
                {
                    var projectDetail = await jobService.GetProjectDetailStatistics(jobId);
                    if (projectDetail.SuccessJob != projectDetail.TotalJob) return BadRequest();
                }
                var success = await jobService.UpdateJob(jobId, model);
                if (job.JobStatus == JobStatus.Completed && model.JobStatus != JobStatus.Completed && job.ParentId.HasValue)
                {
                    var internalStatus = model.JobStatus.ToInternalJobStatus();
                    if (internalStatus == InternalJobStatus.NotDo) internalStatus = InternalJobStatus.Doing;
                    _ = await internalJobService.UpdateInternalJobStatus(job.ParentId.Value, internalStatus);
                }
                // trigger notification
                if (success)
                {
                    await notificationService.Trigger(jobId, job, null, NotiAction.UpdateJob);
                }
                return success ? Ok() : BadRequest();
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when updating the job {jobId}. Error: {ex}");
                return StatusCode(500);
            }
        }

        [Authorize(Policy = PolicyConstants.Internal)]
        [RequestSizeLimit(PolicyConstants.requirementFileSize)]
        [RequestFormLimits(MultipartBodyLengthLimit = PolicyConstants.requirementFileSize)]
        [HttpPost("{jobId}/final")]
        public async Task<IActionResult> UpdateFinal([FromRoute] Guid jobId, [FromForm] UpdateFileRequest model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to update final files for job {jobId}.");
                var job = await jobService.GetBasicJob(jobId);
                if (job == null) return NotFound();
                if (job.JobStatus == JobStatus.Completed && ApiContext.Current.Role != RoleType.Admin) return Forbid();
                if (job.PaymentSuccess) return Forbid();

                var keepingFiles = JsonConvert.DeserializeObject<List<FileItem>>(model.OldFiles) ?? new();
                var jobFolderPath = FileUtility.GetFolderPath(ApiConstants.FinalUploadFolder, jobId.ToString());
                FileUtility.RemoveOldFiles(jobFolderPath, keepingFiles);
                var folderModel = new FolderItem
                {
                    Folder = jobId.ToString(),
                    Files = keepingFiles
                };
                foreach (var file in model.Files)
                {
                    var fileModel = await FileUtility.SaveFile(ApiConstants.FinalUploadFolder, jobId.ToString(), file);
                    folderModel.Files.Add(fileModel);
                }
                await jobService.UpdateFinalProductsToLocal(jobId, folderModel);
                return Ok(folderModel);
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when updating final files for job {jobId}. Error: {ex}");
                return StatusCode(500);
            }
        }

        [Authorize(Policy = PolicyConstants.Internal)]
        [RequestSizeLimit(PolicyConstants.previewFileSize)]
        [RequestFormLimits(MultipartBodyLengthLimit = PolicyConstants.previewFileSize)]
        [HttpPost("{jobId}/preview")]
        public async Task<IActionResult> UpdatePreview([FromRoute] Guid jobId, [FromForm] UpdateFileRequest model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to update preview files for job {jobId}.");
                model.Files = model.Files.Where(file => file.ContentType.StartsWith("image/")).ToList();
                if (!model.Files.Any()) return BadRequest();

                var job = await jobService.GetBasicJob(jobId);
                if (job == null) return NotFound();
                if (job.JobStatus == JobStatus.Completed && ApiContext.Current.Role != RoleType.Admin) return Forbid();
                if (job.PaymentSuccess) return Forbid();

                var keepingFiles = JsonConvert.DeserializeObject<List<FileItem>>(model.OldFiles) ?? new();
                var jobFolderPath = FileUtility.GetFolderPath(ApiConstants.PreviewUploadFolder, jobId.ToString());
                FileUtility.RemoveOldFiles(jobFolderPath, keepingFiles);
                var folderModel = new FolderItem
                {
                    Folder = jobId.ToString(),
                    Files = keepingFiles
                };
                foreach (var file in model.Files)
                {
                    var fileModel = await FileUtility.SaveFile(ApiConstants.PreviewUploadFolder, jobId.ToString(), file);
                    folderModel.Files.Add(fileModel);
                    break; //only accept 1 file
                }
                await jobService.UpdatePreviewProductsToLocal(jobId, folderModel);
                return Ok(folderModel);
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when updating preview files for job {jobId}. Error: {ex}");
                return StatusCode(500);
            }
        }

        [Authorize(Policy = PolicyConstants.CreateJob)]
        [RequestSizeLimit(PolicyConstants.requirementFileSize)]
        [RequestFormLimits(MultipartBodyLengthLimit = PolicyConstants.requirementFileSize)]
        [HttpPost("{jobId}/requirement")]
        public async Task<IActionResult> UpdateRequirement([FromRoute] Guid jobId, [FromForm] UpdateFileRequest model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to update requirement files for job {jobId}.");
                var job = await jobService.GetBasicJob(jobId);
                if (job == null) return NotFound();
                if (job.JobStatus == JobStatus.Completed && ApiContext.Current.Role != RoleType.Admin) return Forbid();
                if (job.PaymentSuccess) return Forbid();

                var keepingFiles = JsonConvert.DeserializeObject<List<FileItem>>(model.OldFiles) ?? new();
                var jobFolderPath = FileUtility.GetFolderPath(ApiConstants.RequirementUploadFolder, jobId.ToString());
                FileUtility.RemoveOldFiles(jobFolderPath, keepingFiles);
                var folderModel = new FolderItem
                {
                    Folder = jobId.ToString(),
                    Files = keepingFiles
                };
                foreach (var file in model.Files)
                {
                    var fileModel = await FileUtility.SaveFile(ApiConstants.RequirementUploadFolder, jobId.ToString(), file);
                    folderModel.Files.Add(fileModel);
                }
                await jobService.UpdateRequirementProductsToLocal(jobId, folderModel);
                return Ok(folderModel);
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when updating requirement files for job {jobId}. Error: {ex}");
                return StatusCode(500);
            }
        }

        [Authorize(Roles = PolicyConstants.Admin)]
        [HttpDelete("{jobId}")]
        public async Task<IActionResult> Delete(Guid jobId)
        {
            try
            {
                logger.Info($"{logPrefix} Start to delete job {jobId}.");
                await jobService.Delete(jobId);
                return NoContent();
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when deleting job {jobId}. Error: {ex}");
                return StatusCode(500);
            }
        }

        [Authorize(Roles = PolicyConstants.Admin)]
        [HttpPost("export")]
        public async Task<IActionResult> ExportJobsDetails(ExportJobRequest model)
        {
            var filePath = string.Empty;
            try
            {
                logger.Info($"{logPrefix} Start to export jobs.");
                filePath = await jobService.ExportJobs(model);
                if (string.IsNullOrEmpty(filePath)) return BadRequest();
                var zipPath = FileUtility.ZipFile(filePath);
                _ = new FileExtensionContentTypeProvider().TryGetContentType(zipPath, out string? mediaType);
                return new FileStreamResult(new FileStream(zipPath, FileMode.Open), mediaType ?? "application/octet-stream");
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when exporting jobs. Error: {ex}");
                return StatusCode(500);
            }
            finally
            {
                try
                {
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }
                catch { }
            }
        }

        [Authorize(Roles = PolicyConstants.Admin)]
        [HttpPost("statistics")]
        public async Task<ActionResult<List<JobStatisticsResponse>>> GetJobStatistics(StatisticsJobRequest model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to get job statistics.");
                var response = await jobService.GetJobStatistics(model);
                return response.OrderByDescending(o => o.ExpectedProfit).ThenByDescending(o => o.TotalProfit).ToList();
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when getting job statistics. Error: {ex}");
                return StatusCode(500);
            }
        }

        [Authorize]
        [HttpGet("{id}/projectdetailstatistics")]
        public async Task<ActionResult<ProjectDetailStatistics>> GetProjectDetailStatistics([FromRoute] Guid id)
        {
            try
            {
                logger.Info($"{logPrefix} Start to get project detail statistics.");
                return await jobService.GetProjectDetailStatistics(id);
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when getting project detail statistics. Error: {ex}");
                return StatusCode(500);
            }
        }

        [Authorize(Roles = PolicyConstants.Admin)]
        [HttpPost("{jobId}/paymentsuccess")]
        public async Task<IActionResult> UpdateJobPaymentSuccess([FromRoute] Guid jobId)
        {
            try
            {
                logger.Info($"{logPrefix} Start to update payment success for {jobId}.");
                var success = await jobService.UpdatePaymentSuccess(jobId);
                return success ? Ok() : BadRequest();
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when updating payment success for {jobId}. Error: {ex}");
                return StatusCode(500);
            }
        }
    }
}
