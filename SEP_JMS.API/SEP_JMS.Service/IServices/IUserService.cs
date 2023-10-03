using SEP_JMS.Model.Api.Request.User;
using SEP_JMS.Model.Models;
using SEP_JMS.Model;

namespace SEP_JMS.Service.IServices
{
    public interface IUserService
    {
        public Task<PagingModel<User>> GetUsers(UserFilterRequest model);
    }
}
