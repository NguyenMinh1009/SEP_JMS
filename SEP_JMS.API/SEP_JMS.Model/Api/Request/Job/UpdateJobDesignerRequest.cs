using SEP_JMS.Model.Enums.System;
using System.ComponentModel.DataAnnotations;

namespace SEP_JMS.Model.Api.Request.Job
{
    public class UpdateJobDesignerRequest
    {
        [EnumDataType(typeof(JobStatus))]
        public JobStatus JobStatus { get; set; }

        public string? FinalLink { get; set; }
    }
}
