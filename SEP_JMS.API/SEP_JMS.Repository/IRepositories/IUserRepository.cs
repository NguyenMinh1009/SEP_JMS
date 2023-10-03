using SEP_JMS.Model.Api.Request.User;
using SEP_JMS.Model;
using SEP_JMS.Model.Models;

namespace SEP_JMS.Repository.IRepositories
{
    public interface IUserRepository : IBaseRepository<User>
    {
        public Task<PagingModel<User>> GetUsers(UserFilterRequest model);

        public Task<User?> Login(UserLoginRequest model);
    }
}
