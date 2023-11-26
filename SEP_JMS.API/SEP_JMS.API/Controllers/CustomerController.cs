using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SEP_JMS.Common;
using SEP_JMS.Common.Constants;
using SEP_JMS.Common.Logger;
using SEP_JMS.Model;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Api.Response;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Service.IServices;

namespace SEP_JMS.API.Controllers
{
    [Route("api/customer")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly string logPrefix = "[CustomerController]";

        private readonly IUserService userService;
        private readonly IJMSLogger logger;
        private readonly IMapper mapper;

        public CustomerController(
            IUserService userService,
            IMapper mapper,
            IJMSLogger logger)
        {
            this.userService = userService;
            this.logger = logger;
            this.mapper = mapper;
        }
        [Authorize(Policy = PolicyConstants.Assign)]
        [HttpPost("find")]
        public async Task<ActionResult<PagingModel<CustomerFindDisplayModel>>> GetCustomers(CustomerFilterRequestModel model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to find customers.");
                return await userService.FindCustomers(model);
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when finding customers. Error: {ex}");
                return StatusCode(500);
            }
        }
        [Authorize(Roles = PolicyConstants.Customer)]
        [HttpGet("permission")]
        public async Task<IActionResult> GetPricePermission()
        {
            try
            {
                logger.Info($"{logPrefix} Start to validate customer permission.");
                var user = await userService.GetUserById(ApiContext.Current.UserId, RoleType.Customer);
                if (user == null) return NotFound();
                return Ok(new { permission = !user.HiddenPrice });
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when validating customer permission. Error: {ex}");
                return StatusCode(500);
            }
        }
        [Authorize(Policy = PolicyConstants.Internal)]
        [HttpPost("related")]
        public async Task<ActionResult<PagingModel<CustomerFindDisplayModel>>> GetRelatedCustomer(CustomerFilterRequestModel model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to get all customers for filter job of account and designer.");
                var res = await userService.GetCustomerForFilterJobInternalRole(model);
                return new PagingModel<CustomerFindDisplayModel>
                {
                    Count = res.Count,
                    Items = mapper.Map<List<CustomerFindDisplayModel>>(res.Items)
                };
            }
            catch (Exception ex)
            {
                logger.Info($"{logPrefix} Got exception when getting all customers for filter job of account and designer. Error: {ex}");
                return StatusCode(500);
            }
        }
    }
}
