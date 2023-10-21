using SEP_JMS.Model.Enums.System;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Model.Api.Request.InternalJob
{
    public class InternalJobStatusUpdateRequestModel
    {
        [EnumDataType(typeof(InternalJobStatus))]
        public InternalJobStatus InternalJobStatus { get; set; }
    }
}
