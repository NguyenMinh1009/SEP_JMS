using SEP_JMS.Model.Enums.System;

namespace SEP_JMS.Model.Api.Response.User
{
    public class EmployeeResponse
    {
        public Guid UserId { get; set; }

        public string Username { get; set; } = null!;

        public string? AvatarUrl { get; set; }

        public string Fullname { get; set; } = null!;

        public long DOB { get; set; }

        public string Email { get; set; } = null!;

        public string? Phone { get; set; }

        public Gender Gender { get; set; }

        public RoleType RoleType { get; set; }
    }
}
