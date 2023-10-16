using SEP_JMS.Model.Enums.Others;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Model.Api.Request.File
{
    public class FileRequestModel
    {
        public string FileName { get; set; } = null!;
        public Guid? CommentId { get; set; }

        [EnumDataType(typeof(PostsType))]
        public PostsType PostsType { get; set; }
    }
}
