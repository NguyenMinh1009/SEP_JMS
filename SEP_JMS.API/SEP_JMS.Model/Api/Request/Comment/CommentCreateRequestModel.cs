using Microsoft.AspNetCore.Http;
using SEP_JMS.Model.Enums.System;
using System.ComponentModel.DataAnnotations;

namespace SEP_JMS.Model.Api.Request.Comment
{
    public class CommentCreateRequestModel
    {
        public Guid? ReplyCommentId { get; set; }

        [Required]
        public string Content { get; set; } = null!;

        [Required]
        [EnumDataType(typeof(VisibleType))]
        public VisibleType VisibleType { get; set; }

        public List<IFormFile> Files { get; set; } = new();
    }
}
