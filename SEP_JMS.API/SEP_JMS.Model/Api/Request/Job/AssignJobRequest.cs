namespace SEP_JMS.Model.Api.Request.Job
{
    public class AssignJobRequest
    {
        public Guid JobId { get; set; }

        public Guid DesignerId { get; set; }
    }
}
