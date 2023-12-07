using SEP_JMS.Model.Api.Response.Company;
using SEP_JMS.Model.Api.Response.JobType;
using SEP_JMS.Model.Api.Response.User;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Model.Models;
using SEP_JMS.Model.Models.ExtensionModels;

namespace SEP_JMS.Model.Api.Response.Job
{
    public class JobResponse
    {
        public Guid JobId { get; set; }

        public CustomerResponse Customer { get; set; } = null!;

        public EmployeeResponse Account { get; set; } = null!;

        public UserResponse CreatedBy { get; set; } = null!;

        public EmployeeResponse? Designer { get; set; }

        public CompanyResponse? Company { get; set; }

        public string Title { get; set; } = null!;

        public string Description { get; set; } = null!;

        public int Quantity { get; set; }

        public JobTypeResponse JobType { get; set; } = null!;

        public long CreatedTime { get; set; }

        public long Deadline { get; set; }

        public long LastUpdated { get; set; }

        public Priority Priority { get; set; }

        public JobStatus JobStatus { get; set; }

        public InternalJobStatus InternalJobStatus { get; set; }

        public FolderItem? Requirements { get; set; }

        public FolderItem? FinalProducts { get; set; }

        public FolderItem? PreviewProducts { get; set; }

        public CorrelationJobType CorrelationType { get; set; }

        public string? FinalLink { get; set; }
    }
}
