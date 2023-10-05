namespace SEP_JMS.Model.Api.Request
{
    public class NotificationFilterRequest : BaseFilterRequest
    {
        public bool Read { get; set; }
        public bool Archived { get; set; }
    }
}
