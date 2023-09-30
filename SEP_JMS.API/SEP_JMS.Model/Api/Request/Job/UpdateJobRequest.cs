using SEP_JMS.Model.Enums.System;
using System.ComponentModel.DataAnnotations;
namespace SEP_JMS.Model.Api.Request.Job
{
    public class UpdateJobRequest
    {
        public string Title { get; set; } = null!;

        public string Description { get; set; } = null!;

        public int Quantity { get; set; }

        public Guid? AccountId { get; set; }

        public Guid? DesignerId { get; set; }

        public Guid JobType { get; set; }

        public long Deadline { get; set; }

        [EnumDataType(typeof(Priority))]
        public Priority Priority { get; set; }

        [EnumDataType(typeof(JobStatus))]
        public JobStatus JobStatus { get; set; }

        public string? FinalLink { get; set; }

        [EnumDataType(typeof(CorrelationJobType))]
        public CorrelationJobType CorrelationType { get; set; }
    }
}
