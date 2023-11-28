using SEP_JMS.Model.Models;

namespace SEP_JMS.Repository.IRepositories
{
    public interface IJobTypeRepository : IBaseRepository<JobType>
    {
        public Task<bool> CreateJobType(JobType jt);
        public Task<bool> DeleteJobType(Guid id);
    }
}
