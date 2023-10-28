using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model;
using SEP_JMS.Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Service.IServices
{
    public interface IPriceService
    {
        public Task<PriceGroup?> GetGroup(Guid groupId);
        public Task<PagingModel<PriceGroup>> GetPriceGroups(PriceGroupFilterRequestModel model);
        public Task<List<Price>> GetPrices(Guid groupId);
        public Task<PriceGroup> AddPriceGroup(AddGroupPriceRequestModel model);
        public Task<PriceGroup> UpdatePriceGroup(Guid id, UpdatePriceGroupRequestModel model);
        public Task<bool> UsedInCompany(Guid groupId);
        public Task DeletePriceGroup(Guid groupId);
    }
}
