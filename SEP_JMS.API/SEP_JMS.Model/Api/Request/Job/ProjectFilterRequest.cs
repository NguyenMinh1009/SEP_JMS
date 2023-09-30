namespace SEP_JMS.Model.Api.Request.Job
{
    public class ProjectFilterRequest : BaseFilterRequest
    {
        public string SearchText { get; set; } = string.Empty;
    }
}
