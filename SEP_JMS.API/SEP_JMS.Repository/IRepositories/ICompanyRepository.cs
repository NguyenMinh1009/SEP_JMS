﻿using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model;
using SEP_JMS.Model.Models;
using SEP_JMS.Model.Api.Request.File;

namespace SEP_JMS.Repository.IRepositories
{
    public interface ICompanyRepository : IBaseRepository<Company>
    {
        public Task<PagingModel<Company>> GetCompanyForFilterJobAccountAndDesigner(BaseFilterRequest model);
        public Task<PagingModel<Company>> GetCompanies(CompanyFilterRequest model);
        public Task<Company?> GetCompanyById(Guid id);
        public Task<Company?> GetCompany(Guid companyId);
        public Task AddCompany(Company company);
        public Task DeleteCompany(Guid id);
        public Task UpdateCompany(Guid id, CompanyUpdateRequestModel model);
        public Task<PagingModel<Tuple<Company, User, PriceGroup>>> GetCompanies(CompanyAdminFilterRequestModel model);
    }
}
