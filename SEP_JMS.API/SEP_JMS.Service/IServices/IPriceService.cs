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
    }
}
