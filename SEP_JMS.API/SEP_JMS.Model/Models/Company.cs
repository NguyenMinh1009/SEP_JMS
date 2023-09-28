using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SEP_JMS.Model.Models
{
    public class Company
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public Guid CompanyId { get; set; }

        public string CompanyName { get; set; } = null!;

        public string? CompanyAddress { get; set; }

        public string? Description { get; set; }

        public int PriceGroupId { get; set; }

        public Guid AccountId { get; set; }
    }
}
