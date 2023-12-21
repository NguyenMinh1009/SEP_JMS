using AutoMapper;
using SEP_JMS.Common.Logger;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Api.Response;
using SEP_JMS.Model;
using SEP_JMS.Repository.IRepositories;
using SEP_JMS.Service.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Common;
using SEP_JMS.Model.Api.Response.JobType;
using SEP_JMS.Model.Api.Request.InternalJob;

namespace SEP_JMS.Service.Services
{
    public class InternalJobService : IInternalJobService
    {
        private readonly IJobRepository jobRepository;
        private readonly IMapper mapper;
        private readonly IJMSLogger logger;

        public InternalJobService(IJobRepository jobRepository, IMapper mapper, IJMSLogger logger)
        {
            this.jobRepository = jobRepository;
            this.mapper = mapper;
            this.logger = logger;
        }

        public async Task<PagingModel<InternalJobDetailsDisplayModel>> GetAllInternalProjects(InternalProjectFilterRequestModel model)
        {
            var internalJobsInfo = await jobRepository.GetProjects(model);
            var result = new List<InternalJobDetailsDisplayModel>();
            foreach (var internalJobInfo in internalJobsInfo.Items)
            {
                var internalJobDisplay = mapper.Map<InternalJobDetailsDisplayModel>(internalJobInfo.Item1);
                internalJobDisplay.CreatedBy = mapper.Map<UserCommonDisplayModel>(internalJobInfo.Item2);
                internalJobDisplay.Customer = mapper.Map<CustomerBasicDisplayModel>(internalJobInfo.Item3);
                internalJobDisplay.Account = mapper.Map<EmployeeBasicDisplayModel>(internalJobInfo.Item4);
                internalJobDisplay.Company = mapper.Map<CompanyDisplayModel>(internalJobInfo.Item5);
                internalJobDisplay.JobType = mapper.Map<JobTypeDisplayModel>(internalJobInfo.Item6);

                result.Add(internalJobDisplay);
            }
            return new PagingModel<InternalJobDetailsDisplayModel>
            {
                Items = result,
                Count = internalJobsInfo.Count
            };
        }

        public async Task<PagingModel<InternalJobDetailsDisplayModel>> GetAllInternalJobs(InternalJobFilterRequestModel model)
        {
            var internalJobsInfo = await jobRepository.GetAllJobs(model);
            var result = new List<InternalJobDetailsDisplayModel>();
            foreach (var internalJobInfo in internalJobsInfo.Items)
            {
                var internalJobDisplay = mapper.Map<InternalJobDetailsDisplayModel>(internalJobInfo.Item1);
                internalJobDisplay.CreatedBy = mapper.Map<UserCommonDisplayModel>(internalJobInfo.Item2);
                internalJobDisplay.Customer = mapper.Map<CustomerBasicDisplayModel>(internalJobInfo.Item3);
                internalJobDisplay.Account = mapper.Map<EmployeeBasicDisplayModel>(internalJobInfo.Item4);
                internalJobDisplay.Designer = mapper.Map<EmployeeBasicDisplayModel>(internalJobInfo.Item5);
                internalJobDisplay.Company = mapper.Map<CompanyDisplayModel>(internalJobInfo.Item6);
                internalJobDisplay.JobType = mapper.Map<JobTypeDisplayModel>(internalJobInfo.Item7);

                result.Add(internalJobDisplay);
            }
            return new PagingModel<InternalJobDetailsDisplayModel>
            {
                Items = result,
                Count = internalJobsInfo.Count
            };
        }

        public async Task<InternalJobDetailsDisplayModel?> GetInternalJob(Guid internalJobId)
        {
            var rs = await jobRepository.GetJob(internalJobId);
            if (rs == null) return null;

            var internalJobDisplay = mapper.Map<InternalJobDetailsDisplayModel>(rs.Item1);
            internalJobDisplay.CreatedBy = mapper.Map<UserCommonDisplayModel>(rs.Item2);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
            internalJobDisplay.Customer = mapper.Map<CustomerBasicDisplayModel>(rs.Item3);
            internalJobDisplay.Account = mapper.Map<EmployeeBasicDisplayModel>(rs.Item4);
            internalJobDisplay.Designer = mapper.Map<EmployeeBasicDisplayModel>(rs.Item5);
            internalJobDisplay.Company = mapper.Map<CompanyDisplayModel>(rs.Item6);
            internalJobDisplay.JobType = mapper.Map<JobTypeDisplayModel>(rs.Item7);

            return internalJobDisplay;
        }

        public async Task<bool> UpdateInternalJobStatus(Guid internalJobId, InternalJobStatus internalJobStatus)
        {
            var job = await jobRepository.GetBasicJob(internalJobId);
            if (job == null || job.PaymentSuccess) return false;
            if(job.CorrelationType == CorrelationJobType.Project && internalJobStatus == InternalJobStatus.Completed)
            {
                var projectDetail = await jobRepository.GetProjectDetailStatistics(internalJobId);
                if(projectDetail.SuccessJob != projectDetail.TotalJob) return false;
            }
            var currentStatus = job.InternalJobStatus;

            switch (ApiContext.Current.Role)
            {
                case RoleType.Admin:
                    break;

                case RoleType.Designer:
                    if (internalJobStatus == InternalJobStatus.Completed || internalJobStatus == InternalJobStatus.Pending) return false;
                    if (currentStatus == InternalJobStatus.Completed || currentStatus == InternalJobStatus.Pending) return false;
                    break;

                case RoleType.Account:
                case RoleType.Customer:
                    if (currentStatus == InternalJobStatus.Completed) return false;
                    break;

                default: return false;
            }

            await jobRepository.UpdateInternalJobStatus(internalJobId, internalJobStatus);
            return true;
        }
    }
}
