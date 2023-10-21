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

                result.Add(internalJobDisplay);
            }
            return new PagingModel<InternalJobDetailsDisplayModel>
            {
                Items = result,
                Count = internalJobsInfo.Count
            };
        }
    }
}
