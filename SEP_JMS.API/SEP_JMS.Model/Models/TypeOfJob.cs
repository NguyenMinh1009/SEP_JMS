using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SEP_JMS.Model.Models
{
    public class TypeOfJob
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public Guid TypeId { get; set; }

        public string TypeName { get; set; } = null!;
    }
}
