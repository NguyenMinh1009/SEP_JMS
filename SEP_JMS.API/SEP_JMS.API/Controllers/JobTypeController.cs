using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SEP_JMS.Common.Logger;
using SEP_JMS.Service.IServices;
using SEP_JMS.Model.Api.Response.JobType;

namespace SEP_JMS.API.Controllers
{
    [Route("api/jobtype")]
    [ApiController]
    public class JobTypeController : ControllerBase
    {
        private readonly string logPrefix = "[JobTypeController]";

        private readonly IJobTypeService jobTypeService;
        private readonly IJMSLogger logger;

        public JobTypeController(IJobTypeService jobTypeService, IJMSLogger logger)
        {
            this.jobTypeService = jobTypeService;
            this.logger = logger;
        }

        [Authorize]
        [HttpGet("all")]
        public async Task<ActionResult<List<JobTypeResponse>>> GetAll()
        {
            try
            {
                logger.Info($"{logPrefix} Start to get all job types.");
                return await jobTypeService.GetJobTypes();
            }
            catch (Exception ex)
            {
                logger.Info($"{logPrefix} Got exception when getting job types. Error: {ex}");
                return StatusCode(500);
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateJobType(string name)
        {
            try
            {
                logger.Info($"{logPrefix} Start to create job type.");
                if (String.IsNullOrEmpty(name)) throw new Exception("Tên loại thiết kế không được để trống");
                var success = await jobTypeService.CreateJobType(name);
                return success ? Ok(): StatusCode(500);
            }
            catch (Exception ex)
            {
                logger.Info($"{logPrefix} Got exception when creating job type. Error: {ex}");
                return BadRequest(ex.Message);
            }
        }
        [Authorize]
        [HttpPost("{id}")]
        public async Task<IActionResult> UpdateJobType([FromRoute] Guid id, string name)
        {
            try
            {
                logger.Info($"{logPrefix} Start to update job type {name}.");
                if (String.IsNullOrEmpty(name)) throw new Exception("Tên loại thiết kế không được để trống");
                var success = await jobTypeService.UpdateJobType(id,name);
                return success ? Ok() : StatusCode(500);
            }
            catch (Exception ex)
            {
                logger.Info($"{logPrefix} Got exception when updating job type {name}. Error: {ex}");
                return BadRequest(ex.Message);
            }
        }
        [Authorize]
        [HttpPost("duplicatename")]
        public async Task<ActionResult<bool>> CheckDuplicateName(string name)
        {
            try
            {
                logger.Info($"{logPrefix} Start to check whether duplicate name of job type {name}.");
                return await jobTypeService.IsExistName(null, name);
            }
            catch (Exception ex)
            {
                logger.Info($"{logPrefix} Got exception when checking whether duplicate name of job type {name}. Error: {ex}");
                return StatusCode(500);
            }
        }
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJobType([FromRoute] Guid id)
        {
            try
            {
                logger.Info($"{logPrefix} Start to delete job type {id}.");
                var success =  await jobTypeService.DeleteJobType(id);
                return success ? Ok() : StatusCode(500);
            }
            catch (Exception ex)
            {
                logger.Info($"{logPrefix} Got exception when deleting job type {id}. Error: {ex}");
                return BadRequest(ex.Message);
            }
        }
    }
}
