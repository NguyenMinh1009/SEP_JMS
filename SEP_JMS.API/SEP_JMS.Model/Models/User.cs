using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using SEP_JMS.Model.Enums.System;

namespace SEP_JMS.Model.Models
{
    [Index(nameof(Username), IsUnique = true, Name = "User_Username_Index")]
    [Index(nameof(Email), nameof(Fullname), Name = "User_Query_Index")]
    public class User
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public Guid UserId { get; set; }

        public string? AvatarUrl { get; set; }

        public string Username { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string Fullname { get; set; } = null!;

        public string? Email { get; set; } = null;

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
        public Guid? CompanyId { get; set; }

        public bool HiddenPrice { get; set; } = false;
        #endregion

        public long CreatedTime { get; set; }

        public AccountStatus AccountStatus { get; set; }
        public string NotificationConfig { get; set; } = string.Empty;

        [DeleteBehavior(DeleteBehavior.Restrict)]
        [ForeignKey("CompanyId")]
        public virtual Company? Company { get; set; } = null!;
    }
}
