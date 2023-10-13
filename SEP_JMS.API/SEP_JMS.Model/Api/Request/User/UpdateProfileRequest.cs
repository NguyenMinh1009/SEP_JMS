using SEP_JMS.Model.Enums.System;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Model.Api.Request.User
{
    public class UpdateProfileRequest
    {
        public string? AvatarUrl { get; set; }

        public string Fullname { get; set; } = null!;

        public string? Phone { get; set; }

        public long? DOB { get; set; }

        public Gender Gender { get; set; }

        public string? Address { get; set; }
    }
}
