using SEP_JMS.Model.Models;
using SEP_JMS.Repository.IRepositories;

namespace SEP_JMS.Repository.Repositories
{
    public class PriceGroupRepository : BaseRepository<PriceGroup>, IPriceGroupRepository
    {
        public PriceGroupRepository(JSMContext context) : base(context)
        {
        }
    }
}
