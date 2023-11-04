using Microsoft.EntityFrameworkCore;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model;
using SEP_JMS.Model.Models;
using SEP_JMS.Repository.IRepositories;

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
            if (!string.IsNullOrEmpty(model.Name)) query = query.Where(group => group.Name.ToLower().Contains(model.Name.ToLower()));

            var count = await query.CountAsync();
            var items = await query.OrderBy(p => p.PriceGroupId)
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
                var priceGr = new PriceGroup
                {
                    PriceGroupId = Guid.NewGuid(),
                    Name = model.Name,
                    Description = model.Description
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
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
        public async Task<PriceGroup> UpdatePriceGroup(Guid id, UpdatePriceGroupRequestModel model)
        {
            using var transaction = await dbcontext.Database.BeginTransactionAsync();
            try
            {
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

                var group = new PriceGroup
                {
                    PriceGroupId = id,
                    Name = model.Name,
                    Description = model.Description
                };
                dbcontext.Update(group);
                await dbcontext.SaveChangesAsync();
                await transaction.CommitAsync();

                dbcontext.Entry(group).State = EntityState.Detached;
                return group;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
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
    }
}
