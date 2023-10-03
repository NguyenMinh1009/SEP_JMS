using SEP_JMS.Model.Enums.System;
using System.ComponentModel.DataAnnotations;

namespace SEP_JMS.Model.Api.Request.User
{
    public class UserFilterRequest : BaseFilterRequest
    {
        public string? SearchText { get; set; }

        [EnumDataType(typeof(RoleType))]
        public RoleType Role { get; set; }
    }
}
