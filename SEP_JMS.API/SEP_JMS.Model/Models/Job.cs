using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using SEP_JMS.Model.Enums.System;

namespace SEP_JMS.Model.Models
{
    [Index(nameof(ParentId),
        nameof(CustomerId),
        nameof(AccountId),
        nameof(CreatedBy),
        nameof(DesignerId),
        nameof(CreatedTime),
        AllDescending = true,
        Name = "Job_Query_Index")]
    public class Job
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public Guid JobId { get; set; }

        public Guid CustomerId { get; set; }

        public Guid ParentId { get; set; }

        public Guid AccountId { get; set; }

        public Guid? DesignerId { get; set; }

        public Guid CreatedBy { get; set; }

        public string Title { get; set; } = null!;

        public string Description { get; set; } = null!;

        public int Quantity { get; set; }

        public Guid JobType { get; set; }

        public long CreatedTime { get; set; }

        public long Deadline { get; set; }

        public long LastUpdated { get; set; }

        public long InternalLastUpdated { get; set; }

        public Priority Priority { get; set; }

        public JobStatus JobStatus { get; set; }

        public InternalJobStatus InternalJobStatus { get; set; }

        public string? Requirements { get; set; }

        //Final Product save on local server
        public string? FinalProducts { get; set; }

        //Use for self upload and provide link
        public string? FinalLink { get; set; }

        //Use for export result
        public string? FinalPreview { get; set; }

        public CorrelationJobType CorrelationType { get; set; } = CorrelationJobType.Job;
    }
}
