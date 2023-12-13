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
using SEP_JMS.Model.Api.Response;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Repository.Repositories;
using SEP_JMS.Model.Models.ExtensionModels;
using System;
using SEP_JMS.Common.Utils;

namespace SEP_JMS.Service.Services
{
    public class UserService : IUserService
    {
        private readonly IJobRepository jobRepository;
        private readonly IUserRepository userRepository;
        private readonly IPriceRepository priceRepository;
        private readonly IPriceGroupRepository priceGroupRepository;
        private readonly IJobTypeRepository jobTypeRepository;
        private readonly ICompanyRepository companyRepository;
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
            IConfiguration configuration,
            ICompanyRepository companyRepository)
        {
            this.jobRepository = jobRepository;
            this.userRepository = userRepository;
            this.priceGroupRepository = priceGroupRepository;
            this.priceRepository = priceRepository;
            this.jobTypeRepository = typeOfJobRepository;

            this.mapper = mapper;
            this.logger = logger;
            this.configuration = configuration;
            this.companyRepository = companyRepository;
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
            var newPassword = GenerateRandomPassword();
            if (String.IsNullOrEmpty(model.Email.Trim())) throw new Exception("Mail không được để trống");
            var users = await userRepository.GetAll(x=>x.Username.Equals(model.UserName) && model.Email.ToLower().Equals(x.Email));
            if (users == null || users.Count == 0) throw new Exception("Không tìm thấy tài khoản");
            var user = users.First();
            int count = await userRepository.ChangePassword(user.UserId, newPassword);
            if (count == 0) throw new Exception("Lỗi Database, vui lòng thử lại");
            EmailHelper.SendEmailResetPasswordAsync(configuration, model.Email, newPassword);
            return;
        }
        private string GenerateRandomPassword()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            const string specialChars = "!@#$%^&*()_-+=<>?";
            const string digits = "0123456789";
            var random = new Random();
            var password = new StringBuilder();
            for (int i = 0; i < 10; i++)
            {
                password.Append(chars[random.Next(chars.Length)]);
            }
            password.Append(specialChars[random.Next(specialChars.Length)]);
            password.Append(digits[random.Next(digits.Length)]);
            return password.ToString();
        }
        public async Task<User?> GetUserByIdWithoutRole(Guid userId)
        {
            return await userRepository.GetUserByIdWithoutRole(userId);
        }
        public async Task<bool> IsValidUsername(string username)
        {
            return await userRepository.IsValidUsername(username);
        }
        public async Task<PagingModel<UserDetailsDisplayModel>> FindUsers(GetUsersRequestModel model)
        {
            var usersInfo = await userRepository.FindUsers(model);
            var users = new List<UserDetailsDisplayModel>();
            foreach (var userInfo in usersInfo.Items)
            {
                var user = mapper.Map<UserDetailsDisplayModel>(userInfo.Item1);
                if (user.RoleType == RoleType.Customer) user.Company = mapper.Map<CompanyDisplayModel>(userInfo.Item2);
                users.Add(user);
            }
            return new PagingModel<UserDetailsDisplayModel>
            {
                Items = users,
                Count = usersInfo.Count
            };
        }
        public async Task ChangeStatus(Guid id, AccountStatus status)
        {
            await userRepository.ChangeStatus(id, status);
        }
        public async Task<Guid?> CreateCustomer(CustomerCreateRequestModel model)
        {
            var company = await companyRepository.GetCompany(model.CompanyId);
            if (company == null) return null;

            var user = mapper.Map<User>(model);
            user.NotificationConfig = "[" + string.Join(",", ((NotiType[])Enum.GetValues(typeof(NotiType))).Select(c => (int)c).ToList()) + "]";
            await userRepository.AddUser(user);
            return user.UserId;
        }
        public async Task UpdateCustomer(Guid id, CustomerAdminUpdateRequestModel model)
        {
            await userRepository.UpdateCustomer(id, model);
        }
        public async Task<Guid?> CreateEmployee(EmployeeCreateRequestModel model)
        {
            if (model.RoleType == RoleType.Customer) return null;

            var user = mapper.Map<User>(model);
            user.NotificationConfig = "[" + string.Join(",", ((NotiType[])Enum.GetValues(typeof(NotiType))).Select(c => (int)c).ToList()) + "]";
            await userRepository.AddUser(user);
            return user.UserId;
        }
        public async Task UpdateEmployee(Guid id, EmployeeAdminUpdateRequestModel model)
        {
            await userRepository.UpdateEmployee(id, model);
        }
        public async Task<User?> GetUserById(Guid userId, RoleType role)
        {
            return await userRepository.GetUserById(userId, role);
        }
        public async Task<PagingModel<EmployeeBasicDisplayModel>> FindDesigners(UserFilterRequest model)
        {
            var designersInfo = await userRepository.FindDesigners(model);
            var designers = new List<EmployeeBasicDisplayModel>();
            foreach (var designerInfo in designersInfo.Items)
            {
                var designer = mapper.Map<EmployeeBasicDisplayModel>(designerInfo);
                designers.Add(designer);
            }
            return new PagingModel<EmployeeBasicDisplayModel>
            {
                Items = designers,
                Count = designersInfo.Count
            };
        }
        public async Task<PagingModel<EmployeeBasicDisplayModel>> FindAccounts(UserFilterRequest model)
        {
            var accountsInfo = await userRepository.FindAccounts(model);
            var accounts = new List<EmployeeBasicDisplayModel>();
            foreach (var accountInfo in accountsInfo.Items)
            {
                var account = mapper.Map<EmployeeBasicDisplayModel>(accountInfo);
                accounts.Add(account);
            }
            return new PagingModel<EmployeeBasicDisplayModel>
            {
                Items = accounts,
                Count = accountsInfo.Count
            };
        }
        public async Task<PagingModel<CustomerFindDisplayModel>> FindCustomers(CustomerFilterRequestModel model)
        {
            var customersInfo = await userRepository.FindCustomers(model);
            var customers = new List<CustomerFindDisplayModel>();
            foreach (var customerInfo in customersInfo.Items)
            {
                var customer = mapper.Map<CustomerFindDisplayModel>(customerInfo.Item1);
                customer.Account = mapper.Map<AccountFindDisplayModel>(customerInfo.Item2);
                customer.Company = mapper.Map<CompanyDisplayModel>(customerInfo.Item3);
                customers.Add(customer);
            }
            return new PagingModel<CustomerFindDisplayModel>
            {
                Items = customers,
                Count = customersInfo.Count
            };
        }
        public async Task<PagingModel<User>> GetCustomerForFilterJobInternalRole(CustomerFilterRequestModel model)
        {
            return await userRepository.GetCustomerForFilterJobInternalRole(model);
        }

        public async Task<bool> UpdateAvatar(Guid userId, string path)
        {
            return await userRepository.UpdateAvatar(userId, path);
        }

        public async Task<string> GetAvatar(Guid userId)
        {
            return await userRepository.GetAvatar(userId);
        }

        public async Task<int> CountUserByRole(RoleType role)
        {
            return await userRepository.Count(u => u.RoleType == role);
        }
    }
}
