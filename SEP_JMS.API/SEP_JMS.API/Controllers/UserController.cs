﻿using Microsoft.AspNetCore.Authorization;
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

namespace SEP_JMS.API.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly string logPrefix = "[UserController]";
        private readonly IUserService userService;
        private readonly IJMSLogger logger;
        private readonly IConfiguration configuration;
        private readonly IMapper mapper;

        public UserController(IUserService userService,
            IMapper mapper,
            IConfiguration configuration,
            IJMSLogger logger)
        {
            this.userService = userService;
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
                if (user == null) return BadRequest();
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
                return StatusCode(500);
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
    }
}
