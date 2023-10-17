using SEP_JMS.Model.Models.ExtensionModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Model.Api.Response.Comment
{
    public class CommentDetailsDisplayModel
    {
        public Guid CommentId { get; set; }

        public Guid CorrelationJobId { get; set; }

        public UserCommonDisplayModel User { get; set; } = null!;

        public ReplyCommentDetailsDisplayModel? ReplyComment { get; set; }

        public string Content { get; set; } = null!;

        public FolderItem? Attachments { get; set; }

        public long CreatedTime { get; set; }
    }

    public class ReplyCommentDetailsDisplayModel
    {
        public Guid CommentId { get; set; }

        public Guid CorrelationJobId { get; set; }

        public UserCommonDisplayModel User { get; set; } = null!;

        public string Content { get; set; } = null!;

        public FolderItem? Attachments { get; set; }

        public long CreatedTime { get; set; }
    }
}
