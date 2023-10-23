using SEP_JMS.Model.Api.Request.File;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Model.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Model.Api.Request
{
    public class InternalJobFilterRequestModel : BaseFilterRequest
    {
        public long? From { get; set; }

        public long? To { get; set; }

        public string? SearchText { get; set; }

        [EnumDataType(typeof(InternalJobStatus))]
        public InternalJobStatus? InternalJobStatus { get; set; }

        [EnumDataType(typeof(Priority))]
        public Priority? Priority { get; set; }

        public Guid? CustomerId { get; set; }

        public Guid? CreatedBy { get; set; }

        // [EnumDataType(typeof(JobType))]
        public Guid? JobType { get; set; }

        public Guid? AccountId { get; set; }

        public Guid? CompanyId { get; set; }

        public Guid? DesignerId { get; set; }

        [EnumDataType(typeof(CorrelationJobType))]
        public CorrelationJobType? CorrelationType { get; set; }
    }
}
