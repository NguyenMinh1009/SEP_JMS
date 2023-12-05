using SEP_JMS.Model.Enums.System;
using System.ComponentModel.DataAnnotations;

namespace SEP_JMS.Model.Api.Request
{
    public class EmployeeAdminUpdateRequestModel
    {
        public string Username { get; set; } = null!;

        public string? Password { get; set; } = null!;

        public string Fullname { get; set; } = null!;

        public string? Email { get; set; } = null!;

        public string? Phone { get; set; } = null!;

        public long? DOB { get; set; }

        [EnumDataType(typeof(Gender))]
        public Gender Gender { get; set; }

        public string? IDCardNumber { get; set; } = null!;

        public string? Address { get; set; } = null!;

        public long? OnboardTime { get; set; }

        public long? OffboardTime { get; set; }
        public bool IsNotify { get; set; }

        [EnumDataType(typeof(RoleType))]
        public RoleType RoleType { get; set; }

        [EnumDataType(typeof(AccountStatus))]
        public AccountStatus AccountStatus { get; set; }
    }
}
