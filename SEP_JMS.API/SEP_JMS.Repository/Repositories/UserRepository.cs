using Microsoft.EntityFrameworkCore;
using SEP_JMS.Model;
using SEP_JMS.Model.Api.Request.User;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Model.Models;
using SEP_JMS.Repository.IRepositories;

namespace SEP_JMS.Repository.Repositories
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(JSMContext context) : base(context)
        {
        }

        public async Task<PagingModel<User>> GetUsers(UserFilterRequest model)
        {
            var query = Context.Users.AsQueryable().Where(u => u.RoleType == model.Role);
            if (!string.IsNullOrEmpty(model.SearchText))
                query = query.Where(u => u.Username.ToLower().Contains(model.SearchText.ToLower()) 
                || u.Fullname.ToLower().Contains(model.SearchText.ToLower()));

            var users = await query.OrderByDescending(u => u.Username)
                .Skip((model.PageIndex - 1) * model.PageSize)
                .Take(model.PageSize)
                .AsNoTracking()
                .ToListAsync();
            var count = await query.CountAsync();
            return new PagingModel<User>
            {
                Items = users,
                Count = count
            };
        }
    }
}
