using SEP_JMS.Model.Api.Request.User;
using SEP_JMS.Model;
using SEP_JMS.Model.Models;
using SEP_JMS.Model.Enums.System;

namespace SEP_JMS.Repository.IRepositories
{
    public interface IUserRepository : IBaseRepository<User>
    {
        public Task<PagingModel<User>> GetUsers(UserFilterRequest model);

        public Task<User?> Login(UserLoginRequest model);
        public Task UpdateNotiConfiguration(Guid userId, List<NotiType> notiConfiguration);
        public Task<int> ChangePassword(Guid userId, string newPassword);
        public Task<User?> UpdateProfile(UpdateProfileRequest model);
    }
}
