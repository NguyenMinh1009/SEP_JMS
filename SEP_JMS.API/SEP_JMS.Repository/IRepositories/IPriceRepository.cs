using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model;
using SEP_JMS.Model.Models;

namespace SEP_JMS.Repository.IRepositories
{
    public interface IPriceRepository : IBaseRepository<Price>
    {
        public Task<PriceGroup?> GetPriceGroupById(Guid groupId);
        public Task<PagingModel<PriceGroup>> GetPriceGroups(PriceGroupFilterRequestModel model);
        public Task<List<Price>> GetPriceByGroup(Guid groupId);
        public Task<PriceGroup> AddPriceGroup(AddGroupPriceRequestModel model);
        public Task<PriceGroup> UpdatePriceGroup(Guid id, UpdatePriceGroupRequestModel model);
        public Task<bool> UsedInCompany(Guid groupId);

        public Task DeletePriceGroup(Guid groupId);
    }
}
