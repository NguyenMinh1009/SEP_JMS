using SEP_JMS.Model.Enums.System;
using System.ComponentModel.DataAnnotations;

namespace SEP_JMS.Model.Api.Request.Job
{
    public class InternalJobFilterRequest : BaseFilterRequest
    {
        public Guid? ParentId { get; set; }

        public long? From { get; set; }

        public long? To { get; set; }

        public string? SearchText { get; set; }

        [EnumDataType(typeof(InternalJobStatus))]
        public InternalJobStatus? InternalJobStatus { get; set; }

        [EnumDataType(typeof(Priority))]
        public Priority? Priority { get; set; }

        public Guid? CustomerId { get; set; }

        public Guid? CreatedBy { get; set; }

        public Guid? JobType { get; set; }

        public Guid? AccountId { get; set; }

        public Guid? CompanyId { get; set; }

        public Guid? DesignerId { get; set; }

        [EnumDataType(typeof(CorrelationJobType))]
        public CorrelationJobType? CorrelationType { get; set; }
    }
}
