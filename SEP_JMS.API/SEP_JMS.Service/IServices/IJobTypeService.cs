using SEP_JMS.Model.Api.Response.JobType;

namespace SEP_JMS.Service.IServices
{
    public interface IJobTypeService
    {
        public Task<List<JobTypeResponse>> GetJobTypes();
    }
}
