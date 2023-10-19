using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Model.Api.Request
{
    public class CompanyCreateRequestModel
    {
        public string CompanyName { get; set; } = null!;

        public string? CompanyAddress { get; set; }

        public string? Description { get; set; }

        public Guid PriceGroupId { get; set; }

        public Guid AccountId { get; set; }
    }
}
