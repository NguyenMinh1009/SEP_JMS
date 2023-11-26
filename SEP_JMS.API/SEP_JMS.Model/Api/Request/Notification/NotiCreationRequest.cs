using SEP_JMS.Model.Enums.System;

namespace SEP_JMS.Model.Api.Request
{
    public class NotiCreationRequest
    {
        public Guid EntityIdentifier { get; set; } // JobId
        public NotiType NotiType { get; set; }
        public string EntityName { get; set; } = string.Empty; //
        public string Title { get; set; } = string.Empty; // Entity Job - Name
        public string Message { get; set; } = string.Empty;
        public string Data { get; set; } = string.Empty;
        public Guid Receiver { get; set; }
    }
}
