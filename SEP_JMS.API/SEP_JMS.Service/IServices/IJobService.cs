using SEP_JMS.Model.Api.Request.Job;
using SEP_JMS.Model.Api.Response.Job;
using SEP_JMS.Model.Models.ExtensionModels;
using SEP_JMS.Model.Models;
using SEP_JMS.Model;
using SEP_JMS.Model.Api.Response;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Repository.Repositories;

namespace SEP_JMS.Service.IServices
{
    public interface IJobService
    {
        public Task<PagingModel<JobResponse>> GetAllProjects(ProjectFilterRequest model);

        public Task<PagingModel<JobResponse>> GetAllJobs(JobFilterRequest model);

        public Task<Guid?> CreateJob(CreateJobRequest model);

        public Task<Tuple<Job, User, User, User, User, Company, JobType>?> GetJob(Guid jobId);

        public Task<Job?> GetBasicJob(Guid jobId);

        public Task<bool> UpdateDesignerJob(Guid jobId, UpdateJobDesignerRequest model);

        public Task<bool> UpdateJob(Guid jobId, UpdateJobRequest model);

        public Task UpdateFinalProductsToLocal(Guid jobId, FolderItem finalFolder);

        public Task UpdatePreviewProductsToLocal(Guid jobId, FolderItem previewFolder);

        public Task UpdateRequirementProductsToLocal(Guid jobId, FolderItem requirementFolder);

        public Task Delete(Guid jobId);

        public Task<string> ExportJobs(ExportJobRequest model);

        public Task<List<JobStatisticsResponse>> GetJobStatistics(StatisticsJobRequest model);

        public Task<ProjectDetailStatistics> GetProjectDetailStatistics(Guid id);

        public Task<int> GetTotalJob();

        public Task<int> GetTotalProject();
    }
}
