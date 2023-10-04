using SEP_JMS.Model.Enums.System;

namespace SEP_JMS.Model.Api.Request.Notification
{
    public class NotiCreationRequest
    {
        public Guid EntityIdentifier { get; set; }
        public NotiType NotiType { get; set; }
        public string EntityName { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string Message { get; set; } = null!;
        public string Data { get; set; } = null!;
        public List<Guid> Receivers { get; set; } = new List<Guid>();
    }
}
