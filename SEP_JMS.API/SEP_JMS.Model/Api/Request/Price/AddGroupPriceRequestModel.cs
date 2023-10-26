using SEP_JMS.Model.Models;
using System.ComponentModel.DataAnnotations;

namespace SEP_JMS.Model.Api.Request
{
    public class AddGroupPriceRequestModel
    {
        [Required]
        [MinLength(1)]
        public string Name { get; set; } = null!;

        public string? Description { get; set; } = null;

        public List<AddPriceRequestModel> Prices { get; set; } = new();
    }

    public class AddPriceRequestModel
    {
        public Guid JobTypeId { get; set; }

        public int UnitPrice { get; set; }

        public string? Description { get; set; } = null;
    }
}
