using SEP_JMS.Model.Enums.System;

namespace SEP_JMS.Model.Api.Response.User
{
    public class UserLoginResponse
    {
        public Guid UserId { get; set; }

        public string Username { get; set; } = null!;

        public string? AvatarUrl { get; set; }

        public string Fullname { get; set; } = null!;

        public Gender Gender { get; set; }

        public long DOB { get; set; }

        public string? Phone { get; set; }

        public string Email { get; set; } = null!;

        public RoleType RoleType { get; set; }

        public bool HiddenPrice { get; set; }

        public string Token { get; set; } = null!;

        public string NotificationConfig { get; set; } = null!;
    }
}
