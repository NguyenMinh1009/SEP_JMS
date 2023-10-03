using SEP_JMS.Model.Models;
using SEP_JMS.Repository.IRepositories;

namespace SEP_JMS.Repository.Repositories
{
    public class JobTypeRepository : BaseRepository<JobType>, IJobTypeRepository
    {
        public JobTypeRepository(JSMContext context) : base(context)
        {
        }
    }
}
