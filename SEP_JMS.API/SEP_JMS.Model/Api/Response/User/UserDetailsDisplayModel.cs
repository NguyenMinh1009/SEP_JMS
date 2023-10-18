using SEP_JMS.Model.Enums.System;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Model.Api.Response
{
    public class UserDetailsDisplayModel
    {
        public Guid UserId { get; set; }

        public string? AvatarUrl { get; set; }

        public string Username { get; set; } = null!;

        public string Fullname { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string? Phone { get; set; }

        public long? DOB { get; set; }

        public Gender Gender { get; set; }

        #region Employee
        public string? IDCardNumber { get; set; }

        public string? Address { get; set; }

        public long? OnboardTime { get; set; }

        public long? OffboardTime { get; set; }
        #endregion

        public RoleType RoleType { get; set; }

        #region Customer
        public CompanyDisplayModel? Company { get; set; }

        public bool HiddenPrice { get; set; } = false;
        #endregion

        public long CreatedTime { get; set; }

        public AccountStatus AccountStatus { get; set; }
    }
}
