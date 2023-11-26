using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace SEP_JMS.Model.Api.Request.Comment
{
    public class CommentUpdateRequestModel
    {
        [Required]
        public string Content { get; set; } = null!;

        public List<IFormFile> Files { get; set; } = new();

        public string OldFiles { get; set; } = string.Empty;
    }
}
