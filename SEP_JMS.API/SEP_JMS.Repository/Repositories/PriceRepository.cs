using Microsoft.EntityFrameworkCore;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model;
using SEP_JMS.Model.Models;
using SEP_JMS.Repository.IRepositories;
using System.Reflection.Metadata.Ecma335;

namespace SEP_JMS.Repository.Repositories
{
    public class PriceRepository : BaseRepository<Price>, IPriceRepository
    {
        private readonly JSMContext dbcontext;
        public PriceRepository(JSMContext context) : base(context)
        {
            dbcontext = context;
        }
        public async Task<PriceGroup?> GetPriceGroupById(Guid groupId)
        {
            return await dbcontext.PriceGroups.AsNoTracking()
                .SingleOrDefaultAsync(gr => gr.PriceGroupId == groupId);
        }
        public async Task<PagingModel<PriceGroup>> GetPriceGroups(PriceGroupFilterRequestModel model)
        {
            var query = dbcontext.PriceGroups.AsNoTracking().AsQueryable();
            if (!string.IsNullOrEmpty(model.Name)) query = query.Where(group => group.Name.ToLower().Contains(model.Name.ToLower()) || (group.Description != null && group.Description.ToLower().Contains(model.Name.ToLower())));

            var count = await query.CountAsync();
            var items = await query.OrderBy(p => p.CreatedTime)
                .Skip((model.PageIndex - 1) * model.PageSize)
                .Take(model.PageSize)
                .ToListAsync();
            return new PagingModel<PriceGroup>
            {
                Count = count,
                Items = items
            };
        }
        public async Task<List<Price>> GetPriceByGroup(Guid groupId)
        {
            return await dbcontext.Prices.AsNoTracking()
                .Where(price => price.PriceGroupId == groupId)
                .ToListAsync();
        }
        public async Task<PriceGroup> AddPriceGroup(AddGroupPriceRequestModel model)
        {
            using var transaction = await dbcontext.Database.BeginTransactionAsync();
            try
            {
                if (await IsDuplicateName(null, model.Name)) throw new Exception("duplicate name");
                var priceGr = new PriceGroup
                {
                    PriceGroupId = Guid.NewGuid(),
                    Name = model.Name.Trim(),
                    Description = model.Description,
                    CreatedTime = DateTime.UtcNow.Ticks
                };
                await dbcontext.AddAsync(priceGr);
                await dbcontext.SaveChangesAsync();
                
                var jobTypes = await dbcontext.TypeOfJobs.AsNoTracking().ToListAsync();
                foreach (var jobType in jobTypes)
                {
                    var price = new Price
                    {
                        PriceId = Guid.NewGuid(),
                        JobTypeId = jobType.TypeId,
                        PriceGroupId = priceGr.PriceGroupId,
                        UnitPrice = 0
                    };
                    var addPriceModel = model.Prices.FirstOrDefault(p => p.JobTypeId == jobType.TypeId);
                    if (addPriceModel != null)
                    {
                        price.UnitPrice = addPriceModel.UnitPrice;
                        price.Description = addPriceModel.Description;
                    }

                    await dbcontext.AddAsync(price);
                    await dbcontext.SaveChangesAsync();
                }

                await transaction.CommitAsync();
                dbcontext.Entry(priceGr).State = EntityState.Detached;
                return priceGr;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw ex ?? new Exception("database error");
            }
        }
        public async Task<PriceGroup> UpdatePriceGroup(Guid id, UpdatePriceGroupRequestModel model)
        {
            using var transaction = await dbcontext.Database.BeginTransactionAsync();
            try
            {
                if (await IsDuplicateName(id, model.Name)) throw new Exception("duplicate name");
                foreach (var priceModel in model.Prices)
                {
                    var price = new Price
                    {
                        PriceGroupId = id,
                        PriceId = priceModel.PriceId,
                        Description = priceModel.Description,
                        JobTypeId = priceModel.JobTypeId,
                        UnitPrice = priceModel.UnitPrice
                    };
                    dbcontext.Update(price);
                    await dbcontext.SaveChangesAsync();
                }

                var group = await dbcontext.PriceGroups.FirstOrDefaultAsync(e => e.PriceGroupId == id);
                if (group == null) throw new Exception("cant find price group");
                group.Name = model.Name.Trim();
                group.Description = model.Description;
                dbcontext.Update(group);
                await dbcontext.SaveChangesAsync();
                await transaction.CommitAsync();

                dbcontext.Entry(group).State = EntityState.Detached;
                return group;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw ex ?? new Exception("database error");
            }
        }
        public async Task<bool> UsedInCompany(Guid groupId)
        {
            return await dbcontext.Companies.AnyAsync(comp => comp.PriceGroupId == groupId);
        }

        public async Task DeletePriceGroup(Guid groupId)
        {
            using var transaction = await dbcontext.Database.BeginTransactionAsync();
            try
            {
                _ = await dbcontext.Prices.Where(pr => pr.PriceGroupId == groupId).ExecuteDeleteAsync();
                _ = await dbcontext.PriceGroups.Where(gr => gr.PriceGroupId == groupId).ExecuteDeleteAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        private async Task<bool> IsDuplicateName(Guid? id, string name)
        {
            return await dbcontext.PriceGroups.AnyAsync(e => e.Name.ToLower().Equals(name.Trim().ToLower()) && (id == null || e.PriceGroupId != id));
        }

        public async Task<List<Tuple<Guid, Company, List<Price>>>> GetPricesForAccount(Guid accountId)
        {
            var query = dbcontext.Companies.AsQueryable();
            var rst = from comp in query
                      join price in dbcontext.Prices
                      on comp.PriceGroupId equals price.PriceGroupId
                      where comp.AccountId == accountId
                      group new { comp, price } by comp.CompanyId into gr
                      select Tuple.Create(gr.Key, gr.First().comp, gr.Select(s=>s.price).ToList());
            return await rst.ToListAsync();
        }

        public async Task<List<Tuple<Guid, Company, List<Price>>>> GetPricesForCustomer(Guid customerId)
        {
            var compId = (await dbcontext.Users.Where(e => e.UserId == customerId).FirstOrDefaultAsync())?.CompanyId;
            if (compId == null) return new List<Tuple<Guid, Company, List<Price>>>();
            var query = dbcontext.Companies.AsQueryable();
            var rst = from comp in query
                      join price in dbcontext.Prices
                      on comp.PriceGroupId equals price.PriceGroupId
                      where comp.CompanyId == compId
                      group new { comp, price } by comp.CompanyId into gr
                      select Tuple.Create(gr.Key, gr.First().comp, gr.Select(s => s.price).ToList());
            return await rst.ToListAsync();
        }
    }
}
