using Microsoft.EntityFrameworkCore;
using SEP_JMS.Model;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Models;
using SEP_JMS.Repository.IRepositories;

namespace SEP_JMS.Repository.Repositories
{
    public class CompanyRepository : BaseRepository<Company>, ICompanyRepository
    {
        public CompanyRepository(JSMContext context) : base(context)
        {
        }

        public async Task<PagingModel<Company>> GetCompanies(CompanyFilterRequest model)
        {
            var query = Context.Companies.AsQueryable();
            if (!string.IsNullOrEmpty(model.SearchText)) 
                query = query.Where(u => u.CompanyName.ToLower().Contains(model.SearchText.ToLower()));

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
            await Context.Companies.AddAsync(company);
            await Context.SaveChangesAsync();
        }
        public async Task UpdateCompany(Guid id, CompanyUpdateRequestModel model)
        {
            var company = await Context.Companies.FirstAsync(com => com.CompanyId == id);
            company.CompanyName = model.CompanyName;
            company.CompanyAddress = model.CompanyAddress;
            company.Description = model.Description;
            company.PriceGroupId = model.PriceGroupId;
            company.AccountId = model.AccountId;
            await Context.SaveChangesAsync();
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
