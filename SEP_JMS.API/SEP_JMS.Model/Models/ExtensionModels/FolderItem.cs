namespace SEP_JMS.Model.Models.ExtensionModels
{
    public class FolderItem
    {
        public string Folder { get; set; } = null!;

        public List<FileItem> Files { get; set; } = new();
    }

    public class FileItem
    {
        public string FileName { get; set; } = null!;

        public string OriginalName { get; set; } = null!;

        public string MimeType { get; set; } = null!;
    }
}
