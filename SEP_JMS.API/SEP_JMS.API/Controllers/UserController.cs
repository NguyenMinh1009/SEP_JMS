using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SEP_JMS.Common.Constants;
using SEP_JMS.Model.Api.Request.User;
using SEP_JMS.Model;
using SEP_JMS.Common.Logger;
using SEP_JMS.Model.Api.Response.User;
using SEP_JMS.Service.IServices;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SEP_JMS.Model.Enums.System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using SEP_JMS.Common;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Common.Utils;
using Microsoft.AspNetCore.StaticFiles;
using SEP_JMS.Model.Api.Response;
using SEP_JMS.Service.Services;
using System.Numerics;

namespace SEP_JMS.API.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly string logPrefix = "[UserController]";
        private readonly IUserService userService;
        private readonly ICompanyService companyService;
        private readonly IJMSLogger logger;
        private readonly IConfiguration configuration;
        private readonly IMapper mapper;

        public UserController(IUserService userService,
            ICompanyService companyService,
            IMapper mapper,
            IConfiguration configuration,
            IJMSLogger logger)
        {
            this.userService = userService;
            this.companyService = companyService;
            this.mapper = mapper;
            this.configuration = configuration;
            this.logger = logger;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserLoginResponse>> UserLogin([FromBody] UserLoginRequest model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to process login request for user {model.Username}");
                var user = await userService.Login(model);
                if (user == null) return BadRequest("Sai thông tin đăng nhập");
                var response = mapper.Map<UserLoginResponse>(user);

                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(configuration.GetValue<string>("JwtKey") ?? string.Empty);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Issuer = configuration["JwtIssuer"],
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                        new Claim(ClaimTypes.Name, user.Username),
                        new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                        new Claim(ClaimTypes.Role, user.RoleType.ToString()),
                    }),
                    Expires = DateTime.UtcNow.AddDays(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                response.Token = tokenHandler.WriteToken(token);
                return response;
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception while processing login request for user {model.Username}. Error: {ex}");
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("profile")]
        public async Task<ActionResult<UserDetailsDisplayModel>> GetUserById()
        {
            var id = ApiContext.Current.UserId;
            try
            {
                logger.Info($"{logPrefix} Start to get profile info by id {id}.");
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

        [Authorize(Policy = PolicyConstants.CreateJob)]
        [HttpPost("search")]
        public async Task<ActionResult<PagingModel<UserResponse>>> FindDesigners(UserFilterRequest model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to search users.");
                if (model.Role == RoleType.Customer && ApiContext.Current.Role == RoleType.Customer) return Forbid();
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

        [Authorize]
        [HttpPost("change_password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordRequest model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to change password for user {model.UserName}.");
                if (!DataVerificationUtility.VerifyPasswordStrong(model.NewPassword)) return BadRequest("New password is invalid format");
                var rs = await userService.ChangePassword(model);
                if(rs>0)
                {
                    return StatusCode(200);
                }
                return BadRequest("Mật khẩu cũ không đúng");
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception while processing change password for user {model.UserName}. Error: {ex}");
                return StatusCode(500);
            }
        }

        [Authorize]
        [HttpPost("update_profile")]
        public async Task<IActionResult> UpdateProfile(UpdateProfileRequest model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to update profile for user {ApiContext.Current.UserId}.");

                // validate input
                if (String.IsNullOrEmpty(model.Fullname.Trim())) return BadRequest("Full name is invalid");
                if (model.Phone != null && !DataVerificationUtility.VerifyPhoneNumber(model.Phone)) return BadRequest("Phone number is invalid");
                if (model.DOB != null && (model.DOB > DateTime.UtcNow.Ticks || model.DOB < 621355968000000000)) return BadRequest("Date of birth is invalid");

                var rs = await userService.UpdateProfile(model);
                return rs == null ? BadRequest() : Ok();
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception while processing update profile for user {ApiContext.Current.UserId}. Error: {ex}");
                return StatusCode(500);
            }
        }

        // [Authorize]
        [HttpPost("forgot_password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest model)
        {
            try
            {
                logger.Info($"{logPrefix} Start to send new password to user {model.UserName}.");
                await userService.ForgotPassword(model);
                return Ok();
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception while processing send new password to user {model.UserName}. Error: {ex}");
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [RequestSizeLimit(PolicyConstants.avatarFileSize)]
        [RequestFormLimits(MultipartBodyLengthLimit = PolicyConstants.avatarFileSize)]
        [HttpPost("avatar")]
        public async Task<IActionResult> UpdateAvatar(IFormFile file)
        {
            try
            {
                logger.Info($"{logPrefix} Start to update avatar for user {ApiContext.Current.UserId}.");
                if (file.Length > PolicyConstants.avatarFileSize || !ApiConstants.AvatarExtensions.Contains(Path.GetExtension(file.FileName))) return BadRequest();
                var fileModel = await FileUtility.SaveOneFile(ApiConstants.AvatarUploadFolder, ApiContext.Current.UserId.ToString(), file);
                if (fileModel != null)
                {
                    await userService.UpdateAvatar(ApiContext.Current.UserId, "api/user/avatar/" + fileModel.FileName);
                }
                return fileModel == null ? BadRequest() : Ok();
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception while processing update profile for user {ApiContext.Current.UserId}. Error: {ex}");
                return StatusCode(500);
            }
        }

        [HttpGet("avatar/{payload}")]
        public async Task<IActionResult> GetAvatar(string payload)
        {
            try
            {
                var fPath = payload.Split("?").First();
                logger.Info($"{logPrefix} Start to get avatar for user {fPath}.");
                // var fPath = await userService.GetAvatar(userId);
                // if (!String.IsNullOrEmpty(fPath)) fPath = fPath.Split("/").Last().Split("?").First();
                var filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, ApiConstants.AvatarUploadFolder, fPath);
                if (!System.IO.File.Exists(filePath)) return StatusCode(404);
                _ = new FileExtensionContentTypeProvider().TryGetContentType(filePath, out string? mediaType);
                return await Task.FromResult(new FileStreamResult(new FileStream(filePath, FileMode.Open), mediaType ?? "application/octet-stream"));
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception while processing update profile for user {ApiContext.Current.UserId}. Error: {ex}");
                return StatusCode(500);
            }
        }
    }
}
