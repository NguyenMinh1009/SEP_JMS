using Microsoft.EntityFrameworkCore;
using SEP_JMS.Model.Models;
using SEP_JMS.Repository.IRepositories;
using System.Data;
using System.Reflection.Metadata.Ecma335;

namespace SEP_JMS.Repository.Repositories
{
    public class JobTypeRepository : BaseRepository<JobType>, IJobTypeRepository
    {
        private readonly JSMContext dbcontext;
        public JobTypeRepository(JSMContext context) : base(context)
        {
            dbcontext = context;
        }

        public async Task<bool> CreateJobType(JobType jt)
        {
            using var transaction = await dbcontext.Database.BeginTransactionAsync();
            try
            {
                await dbcontext.AddAsync(jt);
                dbcontext.SaveChanges();
                var pgs = await dbcontext.PriceGroups.ToListAsync();
                foreach (var p in pgs)
                {
                    var price = new Price
                    {
                        PriceId = Guid.NewGuid(),
                        JobTypeId = jt.TypeId,
                        PriceGroupId = p.PriceGroupId,
                        UnitPrice = 0
                    };

                    await dbcontext.AddAsync(price);
                    await dbcontext.SaveChangesAsync();
                };

                await transaction.CommitAsync();
                dbcontext.Entry(jt).State = EntityState.Detached;
            } catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw ex ?? new Exception("database error");
            }
            return true;
        }

        public async Task<bool> DeleteJobType(Guid id)
        {
            var isExistsJob = await dbcontext.Jobs.AnyAsync(e=> e.JobType == id);
            if (isExistsJob) throw new Exception("loại thiết kế đang được sử dụng");
            await dbcontext.Prices.Where(e => e.JobTypeId == id).ExecuteDeleteAsync();
            await dbcontext.TypeOfJobs.Where(e => e.TypeId == id).ExecuteDeleteAsync();
            return true;
        }
    }
}
