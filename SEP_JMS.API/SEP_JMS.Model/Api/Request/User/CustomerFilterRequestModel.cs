using SEP_JMS.Model.Api.Request.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Model.Api.Request
{
    public class CustomerFilterRequestModel : UserFilterRequest
    {
        public Guid? CompanyId { get; set; } = null;
    }
}
