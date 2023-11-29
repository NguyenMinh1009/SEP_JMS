using SEP_JMS.Model.Api.Response.JobType;
using SEP_JMS.Repository.Repositories;

namespace SEP_JMS.Service.IServices
{
    public interface IJobTypeService
    {
        public Task<List<JobTypeResponse>> GetJobTypes();
        public Task<bool> CreateJobType(string name);
        public Task<bool> IsExistName(Guid? id, string name);
        public Task<bool> UpdateJobType(Guid id, string name);
        public Task<bool> DeleteJobType(Guid id);
    }
}
