using Microsoft.EntityFrameworkCore;
using SEP_JMS.Common;
using SEP_JMS.Model;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Api.Request.File;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Model.Models;
using SEP_JMS.Repository.IRepositories;

namespace SEP_JMS.Repository.Repositories
{
    public class CompanyRepository : BaseRepository<Company>, ICompanyRepository
    {
        public CompanyRepository(JSMContext context) : base(context)
        {
        }

        public async Task<PagingModel<Company>> GetCompanyForFilterJobAccountAndDesigner(BaseFilterRequest model)
        {
            var userId = ApiContext.Current.UserId;

            var query = from customer in Context.Users
                        join job in Context.Jobs
                        on customer.UserId equals job.CustomerId

                        join company in Context.Companies
                        on customer.CompanyId equals company.CompanyId

                        select new { company, job };
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
            else throw new Exception("Not supported role");
            var count = await query.Select(a => a.company).Distinct().CountAsync();
            var items = await query.Select(a => a.company)
                .Distinct()
                .Skip((model.PageIndex - 1) * model.PageSize)
                .Take(model.PageSize).ToListAsync();
            return new PagingModel<Company>
            {
                Count = count,
                Items = items
            };
        }
        public async Task<PagingModel<Company>> GetCompanies(CompanyFilterRequest model, bool isGetAll = false)
        {
            var query = Context.Companies.AsQueryable();
            if (!string.IsNullOrEmpty(model.SearchText)) 
                query = query.Where(u => u.CompanyName.ToLower().Contains(model.SearchText.ToLower()));

            if (!isGetAll) { query = query.Where(c => c.CompanyStatus == CompanyStatus.Active); }

            var companies = await query.OrderByDescending(u => u.CompanyName)
                .Skip((model.PageIndex - 1) * model.PageSize)
                .Take(model.PageSize)
                .AsNoTracking()
                .ToListAsync();
            var count = await query.CountAsync();
            return new PagingModel<Company>
            {
                Items = companies,
                Count = count
            };
        }

        public async Task<Company?> GetCompanyById(Guid id)
        {
            return await Context.Companies.AsNoTracking()
                .SingleOrDefaultAsync(com => com.CompanyId == id);
        }
        public async Task<Company?> GetCompany(Guid companyId)
        {
            return await Context.Companies.AsNoTracking()
                .SingleOrDefaultAsync(com => com.CompanyId == companyId);
        }
        public async Task AddCompany(Company company)
        {
            company.CompanyName = company.CompanyName.Trim();
            if (await IsDupplicateName(null, company.CompanyName)) throw new Exception("Trùng tên công ty");
            await Context.Companies.AddAsync(company);
            await Context.SaveChangesAsync();
        }
        public async Task UpdateCompany(Guid id, CompanyUpdateRequestModel model)
        {
            if (await IsDupplicateName(id, model.CompanyName)) throw new Exception("Trùng tên công ty");
            var company = await Context.Companies.FirstAsync(com => com.CompanyId == id);
            company.CompanyName = model.CompanyName;
            company.CompanyAddress = model.CompanyAddress;
            company.Description = model.Description;
            company.PriceGroupId = model.PriceGroupId;
            company.AccountId = model.AccountId;
            await Context.SaveChangesAsync();
        }

        public async Task UpdateStatus(Guid id, CompanyStatus status)
        {
            int count = await Context.Companies.Where(c => c.CompanyId == id)
                .ExecuteUpdateAsync(notis => notis
                .SetProperty(noti => noti.CompanyStatus, noti => status));
            if (count == 0) throw new Exception("Không tìm thấy công ty");
            return;
        }

        private async Task<bool> IsDupplicateName(Guid? id, string name)
        {
            return await Context.Companies.AnyAsync(e => e.CompanyName.ToLower().Equals(name.Trim().ToLower()) && (id == null || e.CompanyId != id));
        }
        public async Task<PagingModel<Tuple<Company, User, PriceGroup>>> GetCompanies(CompanyAdminFilterRequestModel model)
        {
            var query = Context.Companies.AsQueryable();

            if (model.AccountId.HasValue)
            {
                query = query.Where(c => c.AccountId == model.AccountId.Value);
            }
            if (model.PriceGroupId.HasValue)
            {
                query = query.Where(c => c.PriceGroupId == model.PriceGroupId.Value);
            }
            if (model.SearchText != null)
            {
                query = query.Where(c => c.CompanyName.ToLower().Contains(model.SearchText.ToLower()));
            }

            var finalQuery = from company in query

                             join priceGroup in Context.PriceGroups
                             on company.PriceGroupId equals priceGroup.PriceGroupId
                             into priceGroups
                             from priceGroup in priceGroups.DefaultIfEmpty()

                             join account in Context.Users
                             on company.AccountId equals account.UserId
                             into accounts
                             from account in accounts.DefaultIfEmpty()

                             select new { company, account, priceGroup };

            var companies = await finalQuery.Skip(model.PageSize * (model.PageIndex - 1))
                .Take(model.PageSize)
                .Select(d => Tuple.Create(d.company, d.account, d.priceGroup))
                .AsNoTracking().ToListAsync();
            var count = await query.CountAsync();
            return new PagingModel<Tuple<Company, User, PriceGroup>>
            {
                Items = companies,
                Count = count
            };
        }
    }
}
