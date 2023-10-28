using SEP_JMS.Model.Models;

namespace SEP_JMS.Model.Api.Response
{
    public class PriceListDisplayModel
    {
        public PriceGroup Group { get; set; } = null!;

        public List<Models.Price> Prices { get; set; } = new();
    }
}
