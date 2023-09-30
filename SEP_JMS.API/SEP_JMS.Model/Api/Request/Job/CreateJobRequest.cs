using Microsoft.AspNetCore.Http;
using SEP_JMS.Model.Enums.System;
using System.ComponentModel.DataAnnotations;

namespace SEP_JMS.Model.Api.Request.Job
{
    public class CreateJobRequest
    {
        public Guid? ParentId {  get; set; }

        [Required]
        public Guid CustomerId { get; set; }

        [Required]
        public Guid AccountId { get; set; }

        public Guid? DesignerId { get; set; }

        [Required]
        public string Title { get; set; } = null!;

        [Required]
        public string Description { get; set; } = null!;

        [Required]
        public int Quantity { get; set; }

        [Required]
        public Guid JobType { get; set; }

        [Required]
        public long Deadline { get; set; }

        [Required]
        [EnumDataType(typeof(Priority))]
        public Priority Priority { get; set; }

        [Required]
        [EnumDataType(typeof(JobStatus))]
        public JobStatus JobStatus { get; set; }

        [Required]
        [EnumDataType(typeof(CorrelationJobType))]
        public CorrelationJobType CorrelationType { get; set; }

        public List<IFormFile> RequirementFiles { get; set; } = new();
    }
}
