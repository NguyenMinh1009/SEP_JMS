namespace SEP_JMS.Model.Api.Response
{
    public class NotificationResponse
    {
        public Guid NotificationId { get; set; }
        public Guid EntityIdentifier { get; set; }
        public string EntityName { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string Message { get; set; } = null!;
        public string Data { get; set; } = null!;
        public Guid TriggerBy { get; set; }
        public Guid Receiver { get; set; }
        public long? ReadAt { get; set; }
        public long? ArchivedAt { get; set; }
        public long CreatedTime { get; set; }

    }
}
