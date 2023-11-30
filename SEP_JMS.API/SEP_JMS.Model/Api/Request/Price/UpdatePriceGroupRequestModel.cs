using SEP_JMS.Model.CustomAttributes;
using SEP_JMS.Model.Models;
using System.ComponentModel.DataAnnotations;

namespace SEP_JMS.Model.Api.Request
{
    public class UpdatePriceGroupRequestModel
    {
        [Required]
        [MinLength(1)]
        public string Name { get; set; } = null!;

        public string? Description { get; set; } = null;

        public List<UpdatePriceRequestModel> Prices { get; set; } = new();
    }

    public class UpdatePriceRequestModel
    {
        public Guid PriceId { get; set; }

        public Guid JobTypeId { get; set; }

        [MinValue(0)]
        public int UnitPrice { get; set; }

        public string? Description { get; set; } = null;
    }
}
