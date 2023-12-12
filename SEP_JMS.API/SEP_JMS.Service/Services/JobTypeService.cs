using AutoMapper;
using SEP_JMS.Common.Logger;
using SEP_JMS.Model.Api.Response.JobType;
using SEP_JMS.Model.Models;
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
            types = types.OrderBy(e => e.CreatedTime).ToList();
            return mapper.Map<List<JobTypeResponse>>(types);
        } 
        public async Task<bool> CreateJobType(string name)
        {
            if (await IsExistName(null, name.Trim())) throw new Exception("trùng tên thiết kế");
            var jobType = new JobType()
            {
                TypeId = Guid.NewGuid(),
                TypeName = name.Trim(),
                CreatedTime = DateTime.UtcNow.Ticks
            };
            return await jobTypeRepository.CreateJobType(jobType);
        }
        public async Task<bool> IsExistName(Guid? id, string name)
        {
            var jobTypes = await jobTypeRepository.GetAll(x=>x.TypeName == name.Trim() && (id == null || id != x.TypeId));
            return jobTypes.Count > 0;
        }
        public async Task<bool> UpdateJobType(Guid id, string name)
        {
            if (await IsExistName(id, name.Trim())) throw new Exception("trùng tên thiết kế");
            var jobType = await jobTypeRepository.Get(id);
            if(jobType == null) return false;
            jobType.TypeName = name;
            await jobTypeRepository.Update(jobType);
            return true;
        }
        public async Task<bool> DeleteJobType(Guid id)
        {
            var jobType = await jobTypeRepository.Get(id);
            if( jobType == null) throw new Exception("không tìm thấy loại thiết kế");
            await jobTypeRepository.DeleteJobType(id);
            return true;
        }
    }
}
