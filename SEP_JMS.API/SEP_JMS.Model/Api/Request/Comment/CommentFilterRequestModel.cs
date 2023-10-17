using SEP_JMS.Model.Enums.System;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Model.Api.Request.Comment
{
    public class CommentFilterRequestModel : BaseFilterRequest
    {
        public Guid JobId { get; set; }

        [EnumDataType(typeof(VisibleType))]
        public VisibleType VisibleType { get; set; }

        public long? From { get; set; }

        public long? To { get; set; }
    }
}
