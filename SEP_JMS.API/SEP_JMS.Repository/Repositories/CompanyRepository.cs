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
    }
}
