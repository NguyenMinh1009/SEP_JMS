using AutoMapper;
using SEP_JMS.Common.Logger;
using SEP_JMS.Model.Api.Response.JobType;
using SEP_JMS.Repository.IRepositories;
using SEP_JMS.Service.IServices;

namespace SEP_JMS.Service.Services
{
    public class JobTypeService : IJobTypeService
    {
        private readonly IJobRepository jobRepository;
        private readonly IUserRepository userRepository;
        private readonly IPriceRepository priceRepository;
        private readonly IPriceGroupRepository priceGroupRepository;
        private readonly IJobTypeRepository jobTypeRepository;

        private readonly IJMSLogger logger;
        private readonly IMapper mapper;

        public JobTypeService(IJobRepository jobRepository,
            IUserRepository userRepository,
            IPriceRepository priceRepository,
            IPriceGroupRepository priceGroupRepository,
            IJobTypeRepository typeOfJobRepository,

            IMapper mapper,
            IJMSLogger logger)
        {
            this.jobRepository = jobRepository;
            this.userRepository = userRepository;
            this.priceGroupRepository = priceGroupRepository;
            this.priceRepository = priceRepository;
            this.jobTypeRepository = typeOfJobRepository;

            this.mapper = mapper;
            this.logger = logger;
        }

        public async Task<List<JobTypeResponse>> GetJobTypes()
        {
            var types = await jobTypeRepository.GetAll(type => true, 0, int.MaxValue);
            return mapper.Map<List<JobTypeResponse>>(types);
        } 
    }
}
