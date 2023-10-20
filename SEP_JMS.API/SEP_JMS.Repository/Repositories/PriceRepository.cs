using Microsoft.EntityFrameworkCore;
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
    }
}
