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

        private readonly IJobService jobService;
        private readonly ICompanyService companyService;
        private readonly IJobTypeService jobTypeService;
        private readonly IMapper mapper;
        private readonly IJMSLogger logger;

        public JobTypeController(IJobService jobService,
            ICompanyService companyService,
            IJobTypeService jobTypeService,
            IMapper mapper,
            IJMSLogger logger)
        {
            this.jobService = jobService;
            this.jobTypeService = jobTypeService;
            this.companyService = companyService;
            this.mapper = mapper;
            this.logger = logger;
        }

        [Authorize]
        [HttpPost("all")]
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
    }
}
