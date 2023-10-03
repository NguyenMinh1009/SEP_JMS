namespace SEP_JMS.Model.Api.Response.Company
{
    public class CompanyResponse
    {
        public Guid CompanyId { get; set; }

        public string CompanyName { get; set; } = null!;

        public string? CompanyAddress { get; set; }

        public string? Description { get; set; }
    }
}
