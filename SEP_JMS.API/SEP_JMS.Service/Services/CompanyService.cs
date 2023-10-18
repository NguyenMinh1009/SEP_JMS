using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Models;
using SEP_JMS.Model;
using SEP_JMS.Service.IServices;
using AutoMapper;
using SEP_JMS.Common.Logger;
using SEP_JMS.Repository.IRepositories;

namespace SEP_JMS.Service.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly IJobRepository jobRepository;
        private readonly IUserRepository userRepository;
        private readonly IPriceRepository priceRepository;
        private readonly IPriceGroupRepository priceGroupRepository;
        private readonly IJobTypeRepository jobTypeRepository;
        private readonly ICompanyRepository companyRepository;

        private readonly IJMSLogger logger;
        private readonly IMapper mapper;

        public CompanyService(IJobRepository jobRepository,
            IUserRepository userRepository,
            IPriceRepository priceRepository,
            IPriceGroupRepository priceGroupRepository,
            IJobTypeRepository typeOfJobRepository,
            ICompanyRepository companyRepository, 

            IMapper mapper,
            IJMSLogger logger)
        {
            this.jobRepository = jobRepository;
            this.userRepository = userRepository;
            this.priceGroupRepository = priceGroupRepository;
            this.priceRepository = priceRepository;
            this.jobTypeRepository = typeOfJobRepository;
            this.companyRepository = companyRepository;

            this.mapper = mapper;
            this.logger = logger;
        }

        public async Task<PagingModel<Company>> GetCompanies(CompanyFilterRequest model)
        {
            return await companyRepository.GetCompanies(model);
        }
        public async Task<Company?> GetCompanyById(Guid id)
        {
            return await companyRepository.GetCompanyById(id);
        }
    }
}
