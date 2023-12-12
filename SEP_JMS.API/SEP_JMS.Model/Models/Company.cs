using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using SEP_JMS.Model.Enums.System;

namespace SEP_JMS.Model.Models
{
    public class Company
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public Guid CompanyId { get; set; }

        public string CompanyName { get; set; } = null!;

        public string? CompanyAddress { get; set; }

        public string? Description { get; set; }

        public Guid PriceGroupId { get; set; }

        public Guid AccountId { get; set; }

        public CompanyStatus CompanyStatus { get; set; } = CompanyStatus.Active;

        [DeleteBehavior(DeleteBehavior.Restrict)]
        [ForeignKey("AccountId")]
        public virtual User? Account { get; set; }

        [DeleteBehavior(DeleteBehavior.Restrict)]
        [ForeignKey("PriceGroupId")]
        public virtual PriceGroup? PriceGroup { get; set; }
    }
}
