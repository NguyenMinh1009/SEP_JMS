using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using SEP_JMS.Model.Enums.System;

namespace SEP_JMS.Model.Models
{
    [Index(nameof(UserId), nameof(CorrelationJobId), nameof(CreatedTime), AllDescending = true, Name = "Comment_Query_Index")]
    public class Comment
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public Guid CommentId { get; set; }

        public Guid CorrelationJobId { get; set; }

        public VisibleType VisibleType { get; set; }

        public Guid UserId { get; set; }

        public Guid? ReplyCommentId { get; set; } = null;

        public string Content { get; set; } = null!;

        public string? Attachments { get; set; }

        public long CreatedTime { get; set; }

        public CommentStatus CommentStatus { get; set; }

        [DeleteBehavior(DeleteBehavior.Restrict)]
        [ForeignKey("CorrelationJobId")]
        public virtual Job Job { get; set; } = null!;

        [DeleteBehavior(DeleteBehavior.Restrict)]
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;

        [DeleteBehavior(DeleteBehavior.Restrict)]
        [ForeignKey("ReplyCommentId")]
        public virtual Comment? ReplyComment { get; set; } = null!;
    }
}
