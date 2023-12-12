using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Models;
using SEP_JMS.Model;
using SEP_JMS.Service.IServices;
using AutoMapper;
using SEP_JMS.Common.Logger;
using SEP_JMS.Repository.IRepositories;
using SEP_JMS.Model.Api.Response;
using SEP_JMS.Model.Api.Request.File;
using SEP_JMS.Model.Enums.System;

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

        public async Task<PagingModel<Company>> GetCompanyForFilterJobAccountAndDesigner(BaseFilterRequest model)
        {
            return await companyRepository.GetCompanyForFilterJobAccountAndDesigner(model);
        }
        public async Task<PagingModel<Company>> GetCompanies(CompanyFilterRequest model, bool isGetAll = false)
        {
            return await companyRepository.GetCompanies(model, isGetAll);
        }
        public async Task<PagingModel<Tuple<Company, User, PriceGroup>>> GetCompanies(CompanyAdminFilterRequestModel model)
        {
            return await companyRepository.GetCompanies(model);
        }
        public async Task<Company?> GetCompanyById(Guid id)
        {
            return await companyRepository.GetCompanyById(id);
        }
        public async Task<CompanyDisplayModel> CreateCompany(CompanyCreateRequestModel model)
        {
            var companyModel = mapper.Map<Company>(model);
            companyModel.CompanyStatus = CompanyStatus.Active;
            await companyRepository.AddCompany(companyModel);
            return mapper.Map<CompanyDisplayModel>(companyModel);
        }
        public async Task UpdateCompany(Guid id, CompanyUpdateRequestModel model)
        {
            await companyRepository.UpdateCompany(id, model);
        }
        
        public async Task<int> GetTotalComapy()
        {
            return await companyRepository.Count(c => true);
        }

        public async Task UpdateStatus(Guid id, CompanyStatus status)
        {
            await companyRepository.UpdateStatus(id, status);
        }
    }
}
