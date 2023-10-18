using SEP_JMS.Model.Api.Request.User;
using SEP_JMS.Model;
using SEP_JMS.Model.Models;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Model.Api.Request;

namespace SEP_JMS.Repository.IRepositories
{
    public interface IUserRepository : IBaseRepository<User>
    {
        public Task<PagingModel<User>> GetUsers(UserFilterRequest model);

        public Task<User?> Login(UserLoginRequest model);
        public Task UpdateNotiConfiguration(Guid userId, List<NotiType> notiConfiguration);
        public Task<int> ChangePassword(Guid userId, string newPassword);
        public Task<User?> UpdateProfile(UpdateProfileRequest model);
        public Task<User?> GetUserByIdWithoutRole(Guid userId);
        public Task<bool> IsValidUsername(string username);
        public Task<PagingModel<Tuple<User, Company>>> FindUsers(GetUsersRequestModel model);
        public Task ChangeStatus(Guid id, AccountStatus status);
        public Task AddUser(User user);
        public Task UpdateCustomer(Guid id, CustomerAdminUpdateRequestModel model);
    }
}
