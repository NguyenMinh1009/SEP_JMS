using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using SEP_JMS.Model.Enums.System;

namespace SEP_JMS.Model.Models
{
    public class Notification
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public Guid NotificationId { get; set; }

        // Job Identifier - Job / Project
        public string EntityIdentifier { get; set; } = null!;

        public string EntityName { get; set; } = null!;

        public string Title { get; set; } = null!;

        public string Message { get; set; } = null!;
        
        public string Data { get; set; } = null!;

        // public string Sender { get; set; } = null!;

        // User
        public Guid TriggerBy { get; set; }

        public Guid Receiver { get; set; }

        public long? ReadAt { get; set; }

        public long? ArchivedAt { get; set; }

        public long CreatedTime { get; set; }

        [DeleteBehavior(DeleteBehavior.Restrict)]
        [ForeignKey("TriggerBy")]
        public virtual User UserTrigger { get; set; } = null!;

        [DeleteBehavior(DeleteBehavior.Restrict)]
        [ForeignKey("Receiver")]
        public virtual User UserReceiver { get; set; } = null!;
    }
}
