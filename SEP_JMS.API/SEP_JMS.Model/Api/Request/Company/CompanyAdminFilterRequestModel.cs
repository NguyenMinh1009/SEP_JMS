
namespace SEP_JMS.Model.Api.Request
{
    public class CompanyAdminFilterRequestModel : BaseFilterRequest
    {
        public Guid? AccountId { get; set; } = null;

        public string? SearchText { get; set; } = null;

        public Guid? PriceGroupId { get; set; } = null;
    }
}
