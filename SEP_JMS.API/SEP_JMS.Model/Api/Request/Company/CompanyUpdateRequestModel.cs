
namespace SEP_JMS.Model.Api.Request
{
    public class CompanyUpdateRequestModel
    {
        public string CompanyName { get; set; } = null!;

        public string? CompanyAddress { get; set; }

        public string? Description { get; set; }

        public Guid PriceGroupId { get; set; }

        public Guid AccountId { get; set; }
    }
}
