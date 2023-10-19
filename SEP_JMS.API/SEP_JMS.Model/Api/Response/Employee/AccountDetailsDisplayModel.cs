using SEP_JMS.Model.Enums.System;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Model.Api.Response
{
    public class AccountDetailsDisplayModel
    {
        public Guid UserId { get; set; }

        public string Username { get; set; } = null!;

        public string Fullname { get; set; } = null!;

        public long DOB { get; set; }

        public string Email { get; set; } = null!;

        public string? Phone { get; set; }

        public Gender Gender { get; set; }

        public string? Address { get; set; }

        public long OnboardTime { get; set; }
    }
}
