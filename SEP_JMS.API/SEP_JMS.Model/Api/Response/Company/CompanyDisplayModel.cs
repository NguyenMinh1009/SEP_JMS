using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Model.Api.Response
{
    public class CompanyDisplayModel
    {
        public Guid CompanyId { get; set; }

        public string CompanyName { get; set; } = null!;

        public string? CompanyAddress { get; set; }

        public string? Description { get; set; }
    }
}
