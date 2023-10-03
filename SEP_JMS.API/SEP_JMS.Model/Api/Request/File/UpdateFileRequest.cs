using Microsoft.AspNetCore.Http;

namespace SEP_JMS.Model.Api.Request.File
{
    public class UpdateFileRequest
    {
        public List<IFormFile> Files { get; set; } = new();

        public string OldFiles { get; set; } = string.Empty;
    }
}
