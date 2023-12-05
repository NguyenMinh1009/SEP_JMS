using SEP_JMS.Model.Enums.System;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Model.Api.Request
{
    public class CustomerAdminUpdateRequestModel
    {
        public string Username { get; set; } = null!;

        public string? Password { get; set; } = null!;

        public string Fullname { get; set; } = null!;

        public string? Email { get; set; } = null!;

        public string? Phone { get; set; }

        public long? DOB { get; set; }

        [EnumDataType(typeof(Gender))]
        public Gender Gender { get; set; }

        public bool HiddenPrice { get; set; }

        public bool IsNotify { get; set; }

        [EnumDataType(typeof(AccountStatus))]
        public AccountStatus AccountStatus { get; set; }

        public Guid CompanyId { get; set; }
    }
}
