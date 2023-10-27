using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model;
using SEP_JMS.Model.Models;
using SEP_JMS.Repository.IRepositories;
using SEP_JMS.Service.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Service.Services
{
    public class PriceService : IPriceService
    {
        private readonly IPriceRepository priceRepository;
        public PriceService(IPriceRepository priceRepository)
        {
            this.priceRepository = priceRepository;
        }
        public async Task<PriceGroup?> GetGroup(Guid groupId)
        {
            return await priceRepository.GetPriceGroupById(groupId);
        }
        public async Task<PagingModel<PriceGroup>> GetPriceGroups(PriceGroupFilterRequestModel model)
        {
            return await priceRepository.GetPriceGroups(model);
        }
        public async Task<List<Price>> GetPrices(Guid groupId)
        {
            return await priceRepository.GetPriceByGroup(groupId);
        }
        public async Task<PriceGroup> AddPriceGroup(AddGroupPriceRequestModel model)
        {
            return await priceRepository.AddPriceGroup(model);
        }
        public async Task<PriceGroup> UpdatePriceGroup(Guid id, UpdatePriceGroupRequestModel model)
        {
            return await priceRepository.UpdatePriceGroup(id, model);
        }
        public async Task<bool> UsedInCompany(Guid groupId)
        {
            return await priceRepository.UsedInCompany(groupId);
        }

        public async Task DeletePriceGroup(Guid groupId)
        {
            await priceRepository.DeletePriceGroup(groupId);
        }
    }
}
