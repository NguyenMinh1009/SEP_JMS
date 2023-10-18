using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Models;
using SEP_JMS.Model;

namespace SEP_JMS.Service.IServices
{
    public interface ICompanyService
    {
        public Task<PagingModel<Company>> GetCompanies(CompanyFilterRequest model);
        public Task<Company?> GetCompanyById(Guid id);
    }
}
