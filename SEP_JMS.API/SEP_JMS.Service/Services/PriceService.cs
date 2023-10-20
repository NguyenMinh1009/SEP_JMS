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
    }
}
