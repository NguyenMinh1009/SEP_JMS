using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SEP_JMS.Common.Constants;
using SEP_JMS.Model.Api.Request.User;
using SEP_JMS.Model;
using SEP_JMS.Common.Logger;
using SEP_JMS.Model.Api.Response.User;
using SEP_JMS.Service.IServices;
using AutoMapper;

namespace SEP_JMS.API.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly string logPrefix = "[UserController]";
        private readonly IUserService userService;
        private readonly IJMSLogger logger;
        private readonly IMapper mapper;

        public UserController(IUserService userService,
            IMapper mapper,
            IJMSLogger logger)
        {
            this.userService = userService;
            this.mapper = mapper;
            this.logger = logger;
        }

        [Authorize(Policy = PolicyConstants.CreateJob)]
        [HttpPost("search")]
        public async Task<ActionResult<PagingModel<UserResponse>>> FindDesigners(UserFilterRequest model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to search users.");
                var users = await userService.GetUsers(model);
                var usersResponse = new PagingModel<UserResponse>
                {
                    Count = users.Count,
                    Items = mapper.Map<List<UserResponse>>(users.Items)
                };
                return usersResponse;
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when searching users. Error: {ex}");
                return StatusCode(500);
            }
        }
    }
}
