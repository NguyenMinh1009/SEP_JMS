using SEP_JMS.Model.Api.Request.Job;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Model.Models.ExtensionModels;
using SEP_JMS.Model.Models;
using SEP_JMS.Model;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Api.Response;

namespace SEP_JMS.Repository.IRepositories
{
    public interface IJobRepository : IBaseRepository<Job>
    {
        public Task<PagingModel<Tuple<Job, User, User, User, Company, JobType>>> GetProjects(ProjectFilterRequest model);

        public Task<Tuple<Job, User, User, User, User, Company, JobType>?> GetProject(Guid projectId);

        public Task<PagingModel<Tuple<Job, User, User, User, User, Company, JobType>>> GetAllJobs(JobFilterRequest model);

        public Task<PagingModel<Tuple<Job, User, User, User, User, Company, JobType>>> GetAllJobs(InternalJobFilterRequest model);

        public Task<Tuple<Job, User, User, User, User, Company, JobType>?> GetJob(Guid jobId);

        public Task<Job?> GetBasicJob(Guid jobId);

        public Task<Job?> UpdateDesignerJob(Guid jobId, UpdateJobDesignerRequest model);

        public Task<Job?> UpdateJob(Guid jobId, UpdateJobRequest model);

        public Task UpdateFinalProductsToLocal(Guid jobId, FolderItem finalFolder);

        public Task UpdatePreviewProductsToLocal(Guid jobId, FolderItem requirementFolder);

        public Task UpdateRequirementProductsToLocal(Guid jobId, FolderItem requirementFolder);

        public Task UpdateJobLastUpdatedTime(Guid jobId, long time);

        public Task UpdateInternalJobLastUpdatedTime(Guid jobId, long time);

        public Task UpdateInternalJobStatus(Guid jobId, InternalJobStatus internalJobStatus);

        public Task AssignJob(AssignJobRequest model);

        public Task<List<Tuple<Job, Company>>> GetAllJobsForExport(ExportJobRequest model);

        public Task<List<Tuple<Company, long, int>>> GetJobStatistics(StatisticsJobRequest model, JobStatus? jobStatus);
        public Task<PagingModel<Tuple<Job, User, User, User, User, Company, JobType>>> GetAllJobs(InternalJobFilterRequestModel model);
        public Task<ProjectDetailStatistics> GetProjectDetailStatistics(Guid id);
    }
}
