using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Api.Response;
using SEP_JMS.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Service.IServices
{
    public interface IInternalJobService
    {
        public Task<PagingModel<InternalJobDetailsDisplayModel>> GetAllInternalJobs(InternalJobFilterRequestModel model);
    }
}
