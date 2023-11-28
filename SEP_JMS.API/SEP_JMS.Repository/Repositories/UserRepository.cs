using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using SEP_JMS.Common;
using SEP_JMS.Model;
using SEP_JMS.Model.Api.Request;
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

        public async Task<User?> UpdateProfile(UpdateProfileRequest model)
        {
            var user = await Context.Users.FirstAsync(x=>x.UserId == ApiContext.Current.UserId);
            user.Address = model.Address;
            user.AvatarUrl = model.AvatarUrl;
            user.Fullname = model.Fullname;
            user.Phone = model.Phone;
            user.DOB = model.DOB;
            user.Gender = model.Gender;
            Context.Users.Update(user);
            await Context.SaveChangesAsync();
            Context.Entry(user).State = EntityState.Detached;
            return user;
        }

        public async Task<User?> GetUserByIdWithoutRole(Guid userId)
        {
            return await Context.Users.AsNoTracking().FirstOrDefaultAsync(user => user.UserId == userId);
        }
        public async Task<bool> IsValidUsername(string username)
        {
            return !await Context.Users.AnyAsync(user => user.Username.ToLower() == username.ToLower());
        }

        public async Task<int> ChangePassword(Guid userId, string newPassword)
        {
            var user = await Context.Users.FirstAsync(u => u.UserId == userId);
            user.Password = newPassword;
            return await Context.SaveChangesAsync();
        }
        public async Task<PagingModel<Tuple<User, Company>>> FindUsers(GetUsersRequestModel model)
        {
            var query = from user in Context.Users

                        join company in Context.Companies
                        on user.CompanyId equals company.CompanyId
                        into companies
                        from company in companies.DefaultIfEmpty()

                        where user.RoleType == model.Role

                        select new { user, company };

            if (!string.IsNullOrEmpty(model.SearchText))
            {
                query = from data in query
                        where data.user.Fullname.ToLower().Contains(model.SearchText.ToLower())
                        || data.user.Email != null && data.user.Email.ToLower().Contains(model.SearchText.ToLower())
                        || data.user.Username.ToLower().Contains(model.SearchText.ToLower())
                        select data;
            }
            var accounts = await query.OrderBy(data => data.user.Fullname)
                .ThenBy(data => data.user.Email)
                .Skip((model.PageIndex - 1) * model.PageSize)
                .Take(model.PageSize)
                .Select(data => Tuple.Create(data.user, data.company))
                .AsNoTracking()
                .ToListAsync();
            var count = await query.CountAsync();
            return new PagingModel<Tuple<User, Company>>
            {
                Items = accounts,
                Count = count
            };
        }
        public async Task ChangeStatus(Guid id, AccountStatus status)
        {
            var user = await Context.Users.FirstAsync(u => u.UserId == id);
            user.AccountStatus = status;
            await Context.SaveChangesAsync();
        }
        public async Task AddUser(User user)
        {
            await Context.Users.AddAsync(user);
            await Context.SaveChangesAsync();
        }
        public async Task UpdateCustomer(Guid id, CustomerAdminUpdateRequestModel model)
        {
            var customer = await Context.Users.FirstAsync(cus => cus.UserId == id && cus.RoleType == RoleType.Customer);
            customer.Username = model.Username;
            customer.Password = model.Password ?? customer.Password;
            customer.Fullname = model.Fullname;
            customer.Email = model.Email;
            customer.Phone = model.Phone;
            customer.DOB = model.DOB;
            customer.Gender = model.Gender;
            customer.HiddenPrice = model.HiddenPrice;
            customer.AccountStatus = model.AccountStatus;
            customer.CompanyId = model.CompanyId;
            await Context.SaveChangesAsync();
        }
        public async Task UpdateEmployee(Guid id, EmployeeAdminUpdateRequestModel model)
        {
            var emp = await Context.Users.FirstAsync(cus => cus.UserId == id && cus.RoleType != RoleType.Customer);
            emp.Username = model.Username;
            emp.Password = model.Password ?? emp.Password;
            emp.Fullname = model.Fullname;
            emp.Email = model.Email;
            emp.Phone = model.Phone;
            emp.DOB = model.DOB;
            emp.Gender = model.Gender;
            emp.IDCardNumber = model.IDCardNumber;
            emp.Address = model.Address;
            emp.OnboardTime = model.OnboardTime;
            emp.OffboardTime = model.OffboardTime;
            emp.RoleType = model.RoleType;
            emp.AccountStatus = model.AccountStatus;
            await Context.SaveChangesAsync();
        }
        public async Task<User?> GetUserById(Guid userId, RoleType role)
        {
            return await Context.Users.AsNoTracking().SingleOrDefaultAsync(user => user.UserId == userId && user.RoleType == role);
        }
        public async Task<PagingModel<User>> GetCustomerForFilterJobInternalRole(CustomerFilterRequestModel model)
        {
            var userId = ApiContext.Current.UserId;

            var query = from customer in Context.Users
                        join job in Context.Jobs
                        on customer.UserId equals job.CustomerId

                        join company in Context.Companies
                        on customer.CompanyId equals company.CompanyId

                        select new { customer, company, job };
            if (ApiContext.Current.Role == RoleType.Account)
            {
                query = from data in query
                        where data.job.AccountId == userId
                        select data;
            }
            else if (ApiContext.Current.Role == RoleType.Designer)
            {
                query = from data in query
                        where data.job.DesignerId == userId
                        select data;
            }
            else if (ApiContext.Current.Role == RoleType.Customer) throw new Exception("Not supported role");

            if (model.CompanyId.HasValue)
            {
                query = from data in query
                        where data.company.CompanyId == model.CompanyId.Value
                        select data;
            }
            var count = await query.Select(a => a.customer).Distinct().CountAsync();
            var items = await query.Select(a => a.customer)
                .Distinct()
                .Skip((model.PageIndex - 1) * model.PageSize)
                .Take(model.PageSize).ToListAsync();

            return new PagingModel<User>
            {
                Count = count,
                Items = items
            };
        }
        public async Task<PagingModel<Tuple<User, User, Company>>> FindCustomers(CustomerFilterRequestModel model)
        {
            var query = from customer in Context.Users

                        join company in Context.Companies
                        on customer.CompanyId equals company.CompanyId
                        into companies
                        from company in companies.DefaultIfEmpty()

                        join account in Context.Users
                        on company.AccountId equals account.UserId
                        into accounts
                        from account in accounts.DefaultIfEmpty()

                        where customer.RoleType == RoleType.Customer
                        && customer.AccountStatus == AccountStatus.Active

                        select new { customer, account, company };
            if (model.CompanyId == Guid.Empty)
            {
                query = from data in query
                        where data.customer.CompanyId == null
                        select data;
            }
            else if (model.CompanyId != null)
            {
                query = from data in query
                        where data.customer.CompanyId == model.CompanyId.Value
                        select data;
            }
            if (!string.IsNullOrEmpty(model.SearchText))
            {
                query = from data in query
                        where data.customer.Fullname.ToLower().Contains(model.SearchText.ToLower()) ||
                        (data.customer.Email != null && data.customer.Email.ToLower().Contains(model.SearchText.ToLower()))
                        select data;
            }
            var customers = await query.OrderBy(data => data.customer.Email)
                .ThenBy(data => data.customer.Fullname)
                .Skip((model.PageIndex - 1) * model.PageSize)
                .Take(model.PageSize)
                .Select(data => Tuple.Create(data.customer, data.account, data.company))
                .AsNoTracking()
                .ToListAsync();
            var count = await query.CountAsync();
            return new PagingModel<Tuple<User, User, Company>>
            {
                Items = customers,
                Count = count
            };
        }
        public async Task<PagingModel<User>> FindAccounts(UserFilterRequest model)
        {
            var query = from account in Context.Users
                        where account.AccountStatus == AccountStatus.Active
                        && account.RoleType == RoleType.Account
                        select account;
            if (!string.IsNullOrEmpty(model.SearchText))
            {
                query = from account in query
                        where (account.Email != null && account.Email.ToLower().Contains(model.SearchText.ToLower()))
                        || account.Fullname.ToLower().Contains(model.SearchText.ToLower())
                        select account;
            }
            var accounts = await query.OrderBy(account => account.Fullname)
                .ThenBy(account => account.Email)
                .Skip((model.PageIndex - 1) * model.PageSize)
                .Take(model.PageSize)
                .AsNoTracking()
                .ToListAsync();
            var count = await query.CountAsync();
            return new PagingModel<User>
            {
                Items = accounts,
                Count = count
            };
        }
        public async Task<PagingModel<User>> FindDesigners(UserFilterRequest model)
        {
            var query = from designer in Context.Users
                        where designer.AccountStatus == AccountStatus.Active
                        && designer.RoleType == RoleType.Designer
                        select designer;
            if (!string.IsNullOrEmpty(model.SearchText))
            {
                query = from designer in query
                        where (designer.Email != null && designer.Email.ToLower().Contains(model.SearchText.ToLower()))
                        || designer.Fullname.ToLower().Contains(model.SearchText.ToLower())
                        select designer;
            }
            var designers = await query.OrderBy(designer => designer.Fullname)
                .ThenBy(designer => designer.Email)
                .Skip((model.PageIndex - 1) * model.PageSize)
                .Take(model.PageSize)
                .AsNoTracking()
                .ToListAsync();
            var count = await query.CountAsync();
            return new PagingModel<User>
            {
                Items = designers,
                Count = count
            };
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

        public async Task<bool> UpdateAvatar(Guid userId, string path)
        {
            var user = await Context.Users.FirstAsync(x => x.UserId == userId);
           
            user.AvatarUrl = path;
            
            Context.Users.Update(user);
            var rs = await Context.SaveChangesAsync();
            Context.Entry(user).State = EntityState.Detached;
            return rs != 0;
        }

        public async Task<string> GetAvatar(Guid userId)
        {
            var rs = await GetUserByIdWithoutRole(userId);
            return rs?.AvatarUrl ?? "";
        }
    }
}
