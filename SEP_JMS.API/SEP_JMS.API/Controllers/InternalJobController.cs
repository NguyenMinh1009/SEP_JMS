using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SEP_JMS.Common.Constants;
using SEP_JMS.Common.Logger;
using SEP_JMS.Model;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Api.Response;
using SEP_JMS.Service.IServices;

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
    }
}
