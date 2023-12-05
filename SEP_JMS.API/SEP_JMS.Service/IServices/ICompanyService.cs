using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Models;
using SEP_JMS.Model;
using SEP_JMS.Model.Api.Response;
using SEP_JMS.Model.Api.Request.File;

namespace SEP_JMS.Service.IServices
{
    public interface ICompanyService
    {
        public Task<PagingModel<Company>> GetCompanyForFilterJobAccountAndDesigner(BaseFilterRequest model);
        public Task<PagingModel<Company>> GetCompanies(CompanyFilterRequest model);
        public Task<PagingModel<Tuple<Company, User, PriceGroup>>> GetCompanies(CompanyAdminFilterRequestModel model);
        public Task<Company?> GetCompanyById(Guid id);
        public Task DeleteCompany(Guid id);
        public Task<CompanyDisplayModel> CreateCompany(CompanyCreateRequestModel model);
        public Task UpdateCompany(Guid id, CompanyUpdateRequestModel model);
        public Task<int> GetTotalComapy();
    }
}
