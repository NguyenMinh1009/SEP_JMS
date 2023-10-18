using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SEP_JMS.Common.Constants;
using SEP_JMS.Common.Logger;
using SEP_JMS.Common.Utils;
using SEP_JMS.Model;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Api.Response;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Service.IServices;
using System.Data;

namespace SEP_JMS.API.Controllers
{
    [Route("api/admin")]
    [ApiController]
    [Authorize(Roles = PolicyConstants.Admin)]
    public class AdminController : ControllerBase
    {
        private readonly string logPrefix = "[AdminController]";

        private readonly ICompanyService companyService;
        private readonly IUserService userService;
        //private readonly IPriceService priceService;

        private readonly IMapper mapper;
        private readonly IJMSLogger logger;

        public AdminController(ICommentService commentService,
            ICompanyService companyService,
            IUserService userService,
            //IPriceService priceService,

            IMapper mapper,
            IJMSLogger logger)
        {
            this.companyService = companyService;
            this.userService = userService;
            //this.priceService = priceService;

            this.mapper = mapper;
            this.logger = logger;
        }
        [HttpPost("add/customer")]
        public async Task<ActionResult<UserCreateDisplayModel>> CreateCustomer(CustomerCreateRequestModel model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to create a new customer with username {model.Username}.");
                if (!DataVerificationUtility.VerifyUsernameStrong(model.Username)) BadRequest("Username invalid format");
                if (!DataVerificationUtility.VerifyPasswordStrong(model.Password)) return BadRequest("Password invalid format");
                var userId = await userService.CreateCustomer(model);
                if (userId == null) return StatusCode(500);
                return new UserCreateDisplayModel
                {
                    UserId = userId.Value
                };
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when creating a new customer with username {model.Username}. Error: {ex}");
                return StatusCode(500);
            }
        }
        [HttpPut("update/customer/{id}")]
        public async Task<IActionResult> UpdateCustomer([FromRoute] Guid id, [FromBody] CustomerAdminUpdateRequestModel model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to update customer {id}.");
                if (model.Username != null && !DataVerificationUtility.VerifyUsernameStrong(model.Username)) BadRequest("Username invalid format");
                if (model.Password != null && !DataVerificationUtility.VerifyPasswordStrong(model.Password)) return BadRequest("Password invalid format");
                var company = await companyService.GetCompanyById(model.CompanyId);
                if (company == null) return BadRequest("Invalid company");

                await userService.UpdateCustomer(id, model);
                return Ok();
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when updating customer {id}. Error: {ex}");
                return StatusCode(500);
            }
        }

        [HttpGet("getuser/{id}")]
        public async Task<ActionResult<UserDetailsDisplayModel>> GetUserById([FromRoute] Guid id)
        {
            try
            {
                logger.Info($"{logPrefix} Start to get user by id {id}.");
                var user = await userService.GetUserByIdWithoutRole(id);
                if (user == null) return NotFound();
                var userDisplay = mapper.Map<UserDetailsDisplayModel>(user);

                if (user.RoleType == RoleType.Customer && user.CompanyId != null)
                {
                    var company = await companyService.GetCompanyById(user.CompanyId.Value);
                    userDisplay.Company = company == null ? null : mapper.Map<CompanyDisplayModel>(company);
                }
                return userDisplay;
            }
            catch (Exception ex)
            {
                logger.Info($"{logPrefix} Got exception while getting user by id {id}. Error: {ex}");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("username/validate")]
        public async Task<ActionResult<UsernameCheckDisplayModel>> CheckUsername(UsernameCheckRequestModel model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to check username: {model.Username}.");
                var success = DataVerificationUtility.VerifyUsernameStrong(model.Username);
                if (!success)
                {
                    return new UsernameCheckDisplayModel
                    {
                        IsValid = false
                    };
                }
                return new UsernameCheckDisplayModel
                {
                    IsValid = await userService.IsValidUsername(model.Username)
                };
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when checking username {model.Username}. Error: {ex}");
                return StatusCode(500);
            }
        }

        [HttpPost("users/all")]
        public async Task<ActionResult<PagingModel<UserDetailsDisplayModel>>> FindUsers(GetUsersRequestModel model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to find users.");
                return await userService.FindUsers(model);
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when finding users. Error: {ex}");
                return StatusCode(500);
            }
        }
        [HttpPost("inactive/{id}")]
        public async Task<IActionResult> InactivateUser([FromRoute] Guid id)
        {
            try
            {
                logger.Info($"{logPrefix} Start to change status [Inactive] for {id}.");
                await userService.ChangeStatus(id, AccountStatus.Inactive);
                return Ok();
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when changing status [Inactive] for {id}. Error: {ex}");
                return StatusCode(500);
            }
        }
        [HttpPost("active/{id}")]
        public async Task<IActionResult> ActivateUser([FromRoute] Guid id)
        {
            try
            {
                logger.Info($"{logPrefix} Start to change status [Active] for {id}.");
                await userService.ChangeStatus(id, AccountStatus.Active);
                return Ok();
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when changing status [Active] for {id}. Error: {ex}");
                return StatusCode(500);
            }
        }

    }
}
