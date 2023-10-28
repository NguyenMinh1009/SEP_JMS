using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SEP_JMS.Common.Constants;
using SEP_JMS.Common.Logger;
using SEP_JMS.Model.Api.Response;
using SEP_JMS.Model;
using SEP_JMS.Service.IServices;
using SEP_JMS.Model.Api.Request.User;

namespace SEP_JMS.API.Controllers
{
    [Route("api/employee")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly string logPrefix = "[EmployeeController]";
        private readonly IUserService userService;
        private readonly IJMSLogger logger;

        public EmployeeController(IUserService userService,
            IJMSLogger logger)
        {
            this.userService = userService;
            this.logger = logger;
        }
        [Authorize(Policy = PolicyConstants.Assign)]
        [HttpPost("designer/all")]
        public async Task<ActionResult<PagingModel<EmployeeBasicDisplayModel>>> FindDesigners(UserFilterRequest model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to find designers.");
                return await userService.FindDesigners(model);
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when finding designers. Error: {ex}");
                return StatusCode(500);
            }
        }
        [Authorize(Policy = PolicyConstants.CreateJob)]
        [HttpPost("account/all")]
        public async Task<ActionResult<PagingModel<EmployeeBasicDisplayModel>>> FindAccounts(UserFilterRequest model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to find accounts.");
                return await userService.FindAccounts(model);
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when finding accounts. Error: {ex}");
                return StatusCode(500);
            }
        }
    }
}
