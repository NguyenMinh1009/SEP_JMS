using SEP_JMS.Model.Api.Request.User;
using SEP_JMS.Model.Models;
using SEP_JMS.Model;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Api.Response;
using SEP_JMS.Model.Enums.System;

namespace SEP_JMS.Service.IServices
{
    public interface IUserService
    {
        public Task<PagingModel<User>> GetUsers(UserFilterRequest model);

        public Task<User?> Login(UserLoginRequest model);
        public Task<int> ChangePassword(ChangePasswordRequest model);
        public Task<User?> UpdateProfile(UpdateProfileRequest model);
        public Task ForgotPassword(ForgotPasswordRequest model);
        public Task<User?> GetUserByIdWithoutRole(Guid userId);
        public Task<bool> IsValidUsername(string username);
        public Task<PagingModel<UserDetailsDisplayModel>> FindUsers(GetUsersRequestModel model);
        public Task ChangeStatus(Guid id, AccountStatus status);
        public Task<Guid?> CreateCustomer(CustomerCreateRequestModel model);
        public Task UpdateCustomer(Guid id, CustomerAdminUpdateRequestModel model);
        public Task<Guid?> CreateEmployee(EmployeeCreateRequestModel model);
        public Task UpdateEmployee(Guid id, EmployeeAdminUpdateRequestModel model);
        public Task<User?> GetUserById(Guid userId, RoleType role);
        public Task<PagingModel<EmployeeBasicDisplayModel>> FindDesigners(UserFilterRequest model);
        public Task<PagingModel<EmployeeBasicDisplayModel>> FindAccounts(UserFilterRequest model);
        public Task<PagingModel<CustomerFindDisplayModel>> FindCustomers(CustomerFilterRequestModel model);
        public Task<PagingModel<User>> GetCustomerForFilterJobAccountAndDesigner(CustomerFilterRequestModel model);
    }
}
