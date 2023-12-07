using SEP_JMS.Model.Enums.System;
using SEP_JMS.Model.Models;

namespace SEP_JMS.Common
{
    public class ApiContext
    {
        private static readonly AsyncLocal<ApiContext> instance;

        static ApiContext()
        {
            instance = new AsyncLocal<ApiContext>();
        }

        public static ApiContext Current
        {
            get => instance.Value ??= new ApiContext();
            set => instance.Value = value;
        }

        public Guid UserId { get; set; }

        public string Username { get; set; } = null!;

        public RoleType Role { get; set; }

        public string CorrelationId { get; set; } = Guid.NewGuid().ToString();

        public string? Email { get; set; } = null!;

        public static void Empty()
        {
            if (instance != null) instance.Value = new ApiContext();
        }

        public static void SetUser(User usr)
        {
            ApiContext.Empty();
            ApiContext.Current = new ApiContext { UserId = usr.UserId, Username = usr.Username, Role = usr.RoleType, Email = usr.Email};
        }
    }
}