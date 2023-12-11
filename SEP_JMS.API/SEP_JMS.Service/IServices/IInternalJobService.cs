using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Api.Response;
using SEP_JMS.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Model.Api.Request.InternalJob;

namespace SEP_JMS.Service.IServices
{
    public interface IInternalJobService
    {
        public Task<PagingModel<InternalJobDetailsDisplayModel>> GetAllInternalProjects(InternalProjectFilterRequestModel model);

        public Task<PagingModel<InternalJobDetailsDisplayModel>> GetAllInternalJobs(InternalJobFilterRequestModel model);

        public Task<InternalJobDetailsDisplayModel?> GetInternalJob(Guid internalJobId);

        public Task<bool> UpdateInternalJobStatus(Guid internalJobId, InternalJobStatus internalJobStatus);
    }
}
