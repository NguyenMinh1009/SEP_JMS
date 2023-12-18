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
        private readonly IPriceService priceService;
        private readonly IConfiguration configuration;
        private readonly IMapper mapper;
        private readonly IJMSLogger logger;

        public AdminController(ICompanyService companyService,
            IUserService userService,
            IPriceService priceService,
            IConfiguration configuration,
            IMapper mapper,
            IJMSLogger logger)
        {
            this.companyService = companyService;
            this.userService = userService;
            this.priceService = priceService;

            this.mapper = mapper;
            this.logger = logger;
            this.configuration = configuration;

        }

        [HttpPost("company/all")]
        public async Task<ActionResult<PagingModel<CompanyDetailsDisplayModel>>> GetAllCompanies([FromBody] CompanyAdminFilterRequestModel model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to get companies.");
                var companies = await companyService.GetCompanies(model);
                var result = new List<CompanyDetailsDisplayModel>();
                foreach (var company in companies.Items)
                {
                    result.Add(new CompanyDetailsDisplayModel
                    {
                        PriceGroup = company.Item3,
                        Account = mapper.Map<AccountDetailsDisplayModel>(company.Item2),
                        Company = mapper.Map<CompanyDisplayModel>(company.Item1)
                    });
                }
                return new PagingModel<CompanyDetailsDisplayModel>
                {
                    Count = companies.Count,
                    Items = result
                };
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when getting companies. Error: {ex}");
                return StatusCode(500);
            }
        }
        [HttpGet("company/{companyId}")]
        public async Task<ActionResult<CompanyDetailsDisplayModel>> GetCompany([FromRoute] Guid companyId)
        {
            try
            {
                var response = new CompanyDetailsDisplayModel();
                logger.Info($"{logPrefix} Start to find users.");
                var company = await companyService.GetCompanyById(companyId);
                if (company == null) return NotFound();
                response.Company = mapper.Map<CompanyDisplayModel>(company);
                var account = await userService.GetUserById(company.AccountId, RoleType.Account);
                if (account != null) response.Account = mapper.Map<AccountDetailsDisplayModel>(account);
                var priceGroup = await priceService.GetGroup(company.PriceGroupId);
                if (priceGroup != null) response.PriceGroup = priceGroup;
                return response;
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when finding users. Error: {ex}");
                return StatusCode(500);
            }
        }
        
        [HttpGet("company/{companyId}/active")]
        public async Task<ActionResult<CompanyDetailsDisplayModel>> ActiveCompany([FromRoute] Guid companyId)
        {
            try
            {
                
                await companyService.UpdateStatus(companyId, CompanyStatus.Active);
                return Ok();
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when finding users. Error: {ex}");
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("company/{companyId}/inactive")]
        public async Task<ActionResult<CompanyDetailsDisplayModel>> InActiveCompany([FromRoute] Guid companyId)
        {
            try
            {

                await companyService.UpdateStatus(companyId, CompanyStatus.Inactive);
                return Ok();
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when finding users. Error: {ex}");
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("add/company")]
        public async Task<ActionResult<CompanyDisplayModel>> CreateCompany(CompanyCreateRequestModel model)
        {
            try
            {
                if (String.IsNullOrEmpty(model.CompanyName?.Trim())) throw new Exception("Tên công ty không được để trống");
                logger.Info($"{logPrefix} Start to create a new company with name {model.CompanyName}.");
                var account = await userService.GetUserById(model.AccountId, RoleType.Account);
                if (account == null)
                {
                    logger.Warn($"{logPrefix} Not found account with Id {model.AccountId} when creating company {model.CompanyName}.");
                    return BadRequest("không tìm thấy Account");
                }
                var groupPrice = await priceService.GetGroup(model.PriceGroupId);
                if (groupPrice == null)
                {
                    logger.Warn($"{logPrefix} Not found price group with Id {model.PriceGroupId} when creating company {model.CompanyName}.");
                    return BadRequest("không tìm thấy nhóm giá");
                }

                return await companyService.CreateCompany(model);
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when creating a new company with name {model.CompanyName}. Error: {ex}");
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("update/company/{id}")]
        public async Task<IActionResult> UpdateCompany([FromRoute] Guid id, [FromBody] CompanyUpdateRequestModel model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to update company {id}.");
                var account = await userService.GetUserById(model.AccountId, RoleType.Account);
                if (account == null)
                {
                    logger.Warn($"{logPrefix} Not found account with Id {model.AccountId} when updating company {model.CompanyName}.");
                    return BadRequest();
                }
                var groupPrice = await priceService.GetGroup(model.PriceGroupId);
                if (groupPrice == null)
                {
                    logger.Warn($"{logPrefix} Not found price group with Id {model.PriceGroupId} when updating company {model.CompanyName}.");
                    return BadRequest();
                }

                await companyService.UpdateCompany(id, model);
                return Ok();
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when updating company {id}. Error: {ex}");
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("add/employee")]
        public async Task<ActionResult<UserCreateDisplayModel>> CreateEmployee(EmployeeCreateRequestModel model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to create a new employee with username {model.Username}.");
                if (!DataVerificationUtility.VerifyUsernameStrong(model.Username)) return BadRequest("Username invalid format");
                if (!DataVerificationUtility.VerifyPasswordStrong(model.Password)) return BadRequest("Password invalid format");
                var userId = await userService.CreateEmployee(model);
                if (userId == null) return StatusCode(500);
                if (!String.IsNullOrEmpty(model.Email?.Trim()) && model.IsNotify) EmailHelper.SendEmailNewAccount(configuration, model.Email, model.Fullname, model.Username, model.Password);
                return new UserCreateDisplayModel
                {
                    UserId = userId.Value
                };
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when creating a new employee with username {model.Username}. Error: {ex}");
                return StatusCode(500);
            }
        }
        [HttpPut("update/employee/{id}")]
        public async Task<ActionResult<UserCreateDisplayModel>> UpdateEmployee([FromRoute] Guid id, [FromBody] EmployeeAdminUpdateRequestModel model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to update employee {id}.");
                if (model.Username != null && !DataVerificationUtility.VerifyUsernameStrong(model.Username)) BadRequest("Username invalid format");
                if (model.Password != null && !DataVerificationUtility.VerifyPasswordStrong(model.Password)) return BadRequest("Password invalid format");
                await userService.UpdateEmployee(id, model);
                var usr = await userService.GetUserByIdWithoutRole(id);
                if (usr != null && !String.IsNullOrEmpty(usr?.Email?.Trim()) && !String.IsNullOrEmpty(model.Password) && model.IsNotify) EmailHelper.SendEmailUpdateAccount(configuration, usr.Email, model.Fullname, usr.Username, usr.Password);
                return Ok();
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when updating employee {id}. Error: {ex}");
                return StatusCode(500);
            }
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
                if (!String.IsNullOrEmpty(model.Email?.Trim()) && model.IsNotify) EmailHelper.SendEmailNewAccount(configuration, model.Email, model.Fullname, model.Username, model.Password);
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

                var usr = await userService.GetUserByIdWithoutRole(id);
                if (usr != null && !String.IsNullOrEmpty(usr?.Email?.Trim()) && !string.IsNullOrEmpty(model.Password) && model.IsNotify) EmailHelper.SendEmailUpdateAccount(configuration, usr.Email, model.Fullname, usr.Username, usr.Password);

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
