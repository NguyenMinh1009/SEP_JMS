namespace SEP_JMS.Model.Api.Response.Job
{
    public class JobStatisticsResponse
    {
        public string CompanyName { get; set; } = null!;

        public int TotalJobs { get; set; } = 0;

        public long ExpectedProfit { get; set; } = 0;

        public int TotalFinishedJobs { get; set; } = 0;

        public long TotalProfit { get; set; } = 0;

        public int TotalPaidJobs { get; set; } = 0;

        public long TotalPaid {  get; set; } = 0;
    }
}
