using AutoMapper;
using SEP_JMS.Common.Logger;
using SEP_JMS.Model.Api.Request.User;
using SEP_JMS.Model.Models;
using SEP_JMS.Model;
using SEP_JMS.Repository.IRepositories;
using SEP_JMS.Service.IServices;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Common;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using System.Text;
using System.Net;

namespace SEP_JMS.Service.Services
{
    public class UserService : IUserService
    {
        private readonly IJobRepository jobRepository;
        private readonly IUserRepository userRepository;
        private readonly IPriceRepository priceRepository;
        private readonly IPriceGroupRepository priceGroupRepository;
        private readonly IJobTypeRepository jobTypeRepository;
        private readonly IConfiguration configuration;

        private readonly IJMSLogger logger;
        private readonly IMapper mapper;

        public UserService(IJobRepository jobRepository,
            IUserRepository userRepository,
            IPriceRepository priceRepository,
            IPriceGroupRepository priceGroupRepository,
            IJobTypeRepository typeOfJobRepository,

            IMapper mapper,
            IJMSLogger logger,
            IConfiguration configuration)
        {
            this.jobRepository = jobRepository;
            this.userRepository = userRepository;
            this.priceGroupRepository = priceGroupRepository;
            this.priceRepository = priceRepository;
            this.jobTypeRepository = typeOfJobRepository;

            this.mapper = mapper;
            this.logger = logger;
            this.configuration = configuration;
        }

        public async Task<PagingModel<User>> GetUsers(UserFilterRequest model)
        {
            return await userRepository.GetUsers(model);
        }

        public async Task<User?> Login(UserLoginRequest model)
        {
            return await userRepository.Login(model);
        }

        public async Task<int> ChangePassword(ChangePasswordRequest model)
        {
            var user = await userRepository.Login(new UserLoginRequest() { Password = model.OldPassword, Username = model.UserName });
            if(user != null)
            {
                return await userRepository.ChangePassword(ApiContext.Current.UserId, model.NewPassword);
            }
            return 0;
        }
        public async Task<User?> UpdateProfile(UpdateProfileRequest model)
        {
            return await userRepository.UpdateProfile(model);
        }

        public async Task ForgotPassword(ForgotPasswordRequest model)
        {
            var emailAddress = configuration.GetValue<string>("EmailAddress");
            var emailPassword = configuration.GetValue<string>("EmailPassword");
            SmtpClient smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(emailAddress, emailPassword),
                EnableSsl = true
            };
            MailMessage mailMessage = new MailMessage()
            {
                From = new MailAddress(emailAddress??string.Empty),
                Subject = "Reset password",
                Body = $"Mật khẩu mới: {GenerateRandomPassword()}",
            };
            mailMessage.To.Add(model.Email);
            smtpClient.UseDefaultCredentials = false;
            smtpClient.Send(mailMessage);
        }
        private string GenerateRandomPassword()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            const string specialChars = "!@#$%^&*()_-+=<>?";
            const string digits = "0123456789";
            var random = new Random();
            var password = new StringBuilder(6);
            for (int i = 0; i < 4; i++)
            {
                password.Append(chars[random.Next(chars.Length)]);
            }
            password.Append(specialChars[random.Next(specialChars.Length)]);
            password.Append(digits[random.Next(digits.Length)]);
            return password.ToString();
        }
    }
}
