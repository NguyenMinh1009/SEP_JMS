using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
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

        public async Task UpdateNotiConfiguration(Guid userId, List<NotiType> notiConfiguration)
        {
            var config = JsonConvert.SerializeObject(notiConfiguration);
            await Context.Users.Where(job => job.UserId == userId)
                .ExecuteUpdateAsync(users => users
                .SetProperty(user => user.NotificationConfig, user => config));
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

        public async Task<User?> Login(UserLoginRequest model)
        {
            //var t1 = new JobType
            //{
            //    TypeId = Guid.NewGuid(),
            //    TypeName = "Logo"
            //};
            //var t7 = new JobType
            //{
            //    TypeId = Guid.NewGuid(),
            //    TypeName = "Avatar"
            //};
            //var t6 = new JobType
            //{
            //    TypeId = Guid.NewGuid(),
            //    TypeName = "NameCard"
            //};
            //var t5 = new JobType
            //{
            //    TypeId = Guid.NewGuid(),
            //    TypeName = "Poster"
            //};
            //var t4 = new JobType
            //{
            //    TypeId = Guid.NewGuid(),
            //    TypeName = "Album"
            //};
            //var t3 = new JobType
            //{
            //    TypeId = Guid.NewGuid(),
            //    TypeName = "Adapt"
            //};
            //Context.Add(t1);
            //Context.Add(t3);
            //Context.Add(t4);
            //Context.Add(t5);
            //Context.Add(t6);
            //Context.Add(t7);
            //Context.SaveChanges();

            //var priceGr1 = new PriceGroup
            //{
            //    PriceGroupId = Guid.NewGuid(),
            //    Name = "Default Price",
            //    Description = "Default Price"
            //};
            //Context.Add(priceGr1);
            //Context.SaveChanges();

            //var pr1 = new Price
            //{
            //    PriceId = Guid.NewGuid(),
            //    UnitPrice = 150000,
            //    PriceGroupId = priceGr1.PriceGroupId,
            //    JobTypeId = t1.TypeId
            //};
            //var pr2 = new Price
            //{
            //    PriceId = Guid.NewGuid(),
            //    UnitPrice = 150000,
            //    PriceGroupId = priceGr1.PriceGroupId,
            //    JobTypeId =t3.TypeId
            //};
            //var pr3 = new Price
            //{
            //    PriceId = Guid.NewGuid(),
            //    UnitPrice = 150000,
            //    PriceGroupId = priceGr1.PriceGroupId,
            //    JobTypeId =t4.TypeId
            //};
            //var pr4 = new Price
            //{
            //    PriceId = Guid.NewGuid(),
            //    UnitPrice = 150000,
            //    PriceGroupId = priceGr1.PriceGroupId,
            //    JobTypeId =t5.TypeId
            //};
            //var pr5 = new Price
            //{
            //    PriceId = Guid.NewGuid(),
            //    UnitPrice = 150000,
            //    PriceGroupId = priceGr1.PriceGroupId,
            //    JobTypeId =t6.TypeId
            //};
            //var pr6 = new Price
            //{
            //    PriceId = Guid.NewGuid(),
            //    UnitPrice = 150000,
            //    PriceGroupId = priceGr1.PriceGroupId,
            //    JobTypeId =t7.TypeId
            //};
            //Context.Add(pr1);
            //Context.Add(pr2);
            //Context.Add(pr3);
            //Context.Add(pr4);
            //Context.Add(pr5);
            //Context.Add(pr6);
            //Context.SaveChanges();

            //var acc1 = new User
            //{
            //    UserId = Guid.NewGuid(),
            //    Username = "account1",
            //    AccountStatus = AccountStatus.Active,
            //    CreatedTime = DateTime.UtcNow.Ticks,
            //    Fullname = "Account 1",
            //    Password = "account1",
            //    RoleType = RoleType.Account,
            //    Gender = Gender.Male
            //};
            //var acc2 = new User
            //{
            //    UserId = Guid.NewGuid(),
            //    Username = "account2",
            //    AccountStatus = AccountStatus.Active,
            //    CreatedTime = DateTime.UtcNow.Ticks,
            //    Fullname = "Account 2",
            //    Password = "account2",
            //    RoleType = RoleType.Account,
            //    Gender = Gender.Male
            //};
            //var de1 = new User
            //{
            //    UserId = Guid.NewGuid(),
            //    Username = "designer1",
            //    AccountStatus = AccountStatus.Active,
            //    CreatedTime = DateTime.UtcNow.Ticks,
            //    Fullname = "Designer 1",
            //    Password = "designer1",
            //    RoleType = RoleType.Designer,
            //    Gender = Gender.Male
            //};
            //var de2 = new User
            //{
            //    UserId = Guid.NewGuid(),
            //    Username = "designer2",
            //    AccountStatus = AccountStatus.Active,
            //    CreatedTime = DateTime.UtcNow.Ticks,
            //    Fullname = "Designer 2",
            //    Password = "designer2",
            //    RoleType = RoleType.Designer,
            //    Gender = Gender.Male
            //};
            //var ad1 = new User
            //{
            //    UserId = Guid.NewGuid(),
            //    Username = "admin1",
            //    AccountStatus = AccountStatus.Active,
            //    CreatedTime = DateTime.UtcNow.Ticks,
            //    Fullname = "Admin 1",
            //    Password = "admin1",
            //    RoleType = RoleType.Admin,
            //    Gender = Gender.Male
            //};
            //var ad2 = new User
            //{
            //    UserId = Guid.NewGuid(),
            //    Username = "admin2",
            //    AccountStatus = AccountStatus.Active,
            //    CreatedTime = DateTime.UtcNow.Ticks,
            //    Fullname = "Admin 2",
            //    Password = "admin2",
            //    RoleType = RoleType.Admin,
            //    Gender = Gender.Male
            //};
            //Context.Add(acc1);
            //Context.Add(acc2);
            //Context.Add(de1);
            //Context.Add(de2);
            //Context.Add(ad1);
            //Context.Add(ad2);
            //Context.SaveChanges();

            //var co1 = new Company
            //{
            //    CompanyId = Guid.NewGuid(),
            //    CompanyName = "FPT",
            //    AccountId = acc1.UserId,
            //    PriceGroupId = priceGr1.PriceGroupId
            //};
            //var co2 = new Company
            //{
            //    CompanyId = Guid.NewGuid(),
            //    CompanyName = "VIETTEL",
            //    AccountId = acc2.UserId,
            //    PriceGroupId = priceGr1.PriceGroupId
            //};
            //Context.Add(co1);
            //Context.Add(co2);
            //Context.SaveChanges();

            //var cu1 = new User
            //{
            //    UserId = Guid.NewGuid(),
            //    Username = "customer1",
            //    AccountStatus = AccountStatus.Active,
            //    CreatedTime = DateTime.UtcNow.Ticks,
            //    Fullname = "Customer 1",
            //    Password = "customer1",
            //    RoleType = RoleType.Customer,
            //    Gender = Gender.Male,
            //    CompanyId = co1.CompanyId
            //};
            //var cu2 = new User
            //{
            //    UserId = Guid.NewGuid(),
            //    Username = "customer2",
            //    AccountStatus = AccountStatus.Active,
            //    CreatedTime = DateTime.UtcNow.Ticks,
            //    Fullname = "Customer 2",
            //    Password = "customer2",
            //    RoleType = RoleType.Customer,
            //    Gender = Gender.Male,
            //    CompanyId = co2.CompanyId
            //};
            //Context.Add(cu1);
            //Context.Add(cu2);
            //Context.SaveChanges();

            return await Context.Users.FirstOrDefaultAsync(u => u.Username.ToLower() ==  model.Username.ToLower()
                && u.Password == model.Password);
        }
    }
}
