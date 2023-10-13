using SEP_JMS.Model.Api.Request.User;
using SEP_JMS.Model.Models;
using SEP_JMS.Model;
using SEP_JMS.Model.Api.Request;

namespace SEP_JMS.Service.IServices
{
    public interface IUserService
    {
        public Task<PagingModel<User>> GetUsers(UserFilterRequest model);

        public Task<User?> Login(UserLoginRequest model);
        public Task<int> ChangePassword(ChangePasswordRequest model);
        public Task<User?> UpdateProfile(UpdateProfileRequest model);
        public Task ForgotPassword(ForgotPasswordRequest model);
    }
}
