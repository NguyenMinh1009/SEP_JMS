using SEP_JMS.Model.Models;

namespace SEP_JMS.Model.Api.Response
{
    public class CompanyDetailsDisplayModel
    {
        public CompanyDisplayModel Company { get; set; } = null!;

        public AccountDetailsDisplayModel Account { get; set; } = null!;

        public PriceGroup PriceGroup { get; set; } = null!;
    }
}
