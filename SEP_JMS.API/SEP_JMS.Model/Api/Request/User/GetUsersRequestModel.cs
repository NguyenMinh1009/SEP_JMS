using SEP_JMS.Model.Api.Request.File;
using SEP_JMS.Model.Enums.System;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Model.Api.Request
{
    public class GetUsersRequestModel : BaseFilterRequest
    {
        public string? SearchText { get; set; }

        [EnumDataType(typeof(RoleType))]
        public RoleType Role { get; set; }
    }
}
