namespace SEP_JMS.Model.Api.Request
{
    public class BaseFilterRequest
    {
        public int PageIndex { get; set; } = 1;

        public int PageSize { get; set; } = 10;
    }
}
