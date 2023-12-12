using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Models;
using SEP_JMS.Model;
using SEP_JMS.Model.Api.Response;
using SEP_JMS.Model.Api.Request.File;
using SEP_JMS.Model.Enums.System;

namespace SEP_JMS.Service.IServices
{
    public interface ICompanyService
    {
        public Task<PagingModel<Company>> GetCompanyForFilterJobAccountAndDesigner(BaseFilterRequest model);
        public Task<PagingModel<Company>> GetCompanies(CompanyFilterRequest model, bool isGetAll = false);
        public Task<PagingModel<Tuple<Company, User, PriceGroup>>> GetCompanies(CompanyAdminFilterRequestModel model);
        public Task<Company?> GetCompanyById(Guid id);
        public Task UpdateStatus(Guid id, CompanyStatus status);
        public Task<CompanyDisplayModel> CreateCompany(CompanyCreateRequestModel model);
        public Task UpdateCompany(Guid id, CompanyUpdateRequestModel model);
        public Task<int> GetTotalComapy();
    }
}
