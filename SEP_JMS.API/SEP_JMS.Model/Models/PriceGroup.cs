using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SEP_JMS.Model.Models
{
    [Index(nameof(Name), IsUnique = true)]
    public class PriceGroup
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public Guid PriceGroupId { get; set; }

        public string Name { get; set; } = null!;

        public string? Description { get; set; } = null;
    }
}
