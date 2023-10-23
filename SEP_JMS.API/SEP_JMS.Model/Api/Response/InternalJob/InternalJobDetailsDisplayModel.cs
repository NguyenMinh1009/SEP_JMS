using SEP_JMS.Model.Api.Response.JobType;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Model.Models;
using SEP_JMS.Model.Models.ExtensionModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Model.Api.Response
{
    public class InternalJobDetailsDisplayModel
    {
        public Guid JobId { get; set; }

        public CustomerBasicDisplayModel Customer { get; set; } = null!;

        public EmployeeBasicDisplayModel Account { get; set; } = null!;

        public UserCommonDisplayModel CreatedBy { get; set; } = null!;

        public EmployeeBasicDisplayModel? Designer { get; set; }

        public CompanyDisplayModel? Company { get; set; }

        public string Title { get; set; } = null!;

        public string Description { get; set; } = null!;

        public int Quantity { get; set; }

        public JobTypeDisplayModel JobType { get; set; }

        public long CreatedTime { get; set; }

        public long Deadline { get; set; }

        public long InternalLastUpdated { get; set; }

        public Priority Priority { get; set; }

        public InternalJobStatus InternalJobStatus { get; set; }

        public FolderItem? Requirements { get; set; }

        public FolderItem? FinalProducts { get; set; }

        public FolderItem? PreviewProducts { get; set; }

        public CorrelationJobType CorrelationType { get; set; }

        public string? FinalLink { get; set; }
    }
}
