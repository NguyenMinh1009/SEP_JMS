﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SEP_JMS.Common.Constants;
using SEP_JMS.Common.Logger;
using SEP_JMS.Model;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Api.Request.InternalJob;
using SEP_JMS.Model.Api.Response;
using SEP_JMS.Service.IServices;
using System.Net;

namespace SEP_JMS.API.Controllers
{
    [Route("api/internal/job")]
    [ApiController]
    public class InternalJobController : ControllerBase
    {
        private readonly string logPrefix = "[InternalJobController]";

        private readonly IInternalJobService internalJobService;
        private readonly IJobService jobService;
        private readonly IJMSLogger logger;

        public InternalJobController(IInternalJobService internalJobService,
            IJobService jobService,
            IJMSLogger logger)
        {
            this.internalJobService = internalJobService;
            this.jobService = jobService;
            this.logger = logger;
        }
        [Authorize(Policy = PolicyConstants.Internal)]
        [HttpPost("all")]
        public async Task<ActionResult<PagingModel<InternalJobDetailsDisplayModel>>> GetAll([FromBody] InternalJobFilterRequestModel model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to get all internal jobs.");
                return await internalJobService.GetAllInternalJobs(model);
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when getting all internal jobs. Error: {ex}");
                return StatusCode(500);
            }
        }

        [Authorize(Policy = PolicyConstants.Internal)]
        [HttpGet("{jobId}")]
        public async Task<ActionResult<InternalJobDetailsDisplayModel>> GetInternalJob([FromRoute] Guid jobId)
        {
            try
            {
                logger.Info($"{logPrefix} Start to get the internal job {jobId}.");
                var internalJob = await internalJobService.GetInternalJob(jobId);
                if (internalJob == null) return StatusCode(404);
                return internalJob;
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when getting the internal job {jobId}. Error: {ex}");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
        }

        [Authorize(Policy = PolicyConstants.Internal)]
        [HttpPut("{jobId}/status")]
        public async Task<IActionResult> UpdateInternalJobStatus([FromRoute] Guid jobId, [FromBody] InternalJobStatusUpdateRequestModel model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to update internal job status {model.InternalJobStatus}.");
                var success = await internalJobService.UpdateInternalJobStatus(jobId, model.InternalJobStatus);
                return success ? Ok() : BadRequest();
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when updating internal job status {model.InternalJobStatus}. Error: {ex}");
                return StatusCode(500);
            }
        }
    }
}