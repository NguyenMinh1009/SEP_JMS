namespace SEP_JMS.Common.Constants
{
    public class ApiConstants
    {
        public static readonly string UnkownJobType = "Unknow";
        public static readonly string JobName = "Hàng ngày";
        public static readonly string ProjectName = "Dự án";

        public static readonly string GoogleDriveFolderMimeType = "application/vnd.google-apps.folder";
        public static readonly string GoogleDriveFolderBasePath = "https://drive.google.com/drive/folders";
        public static readonly string GoogleDriveProjectFinalFolder = "ProjectFinalFolder";
        public static readonly string GoogleDriveJobFinalFolder = "JobFinalFolder";

        public static readonly string AvatarUploadFolder = "avatars";
        public static readonly string CommentUploadFolder = "comments";
        public static readonly string RequirementUploadFolder = "jobsrequirements";
        public static readonly string FinalUploadFolder = "jobsfinals";
        public static readonly string PreviewUploadFolder = "jobspreviews";
        public static readonly string ExportFolder = "jobexports";

        public static readonly List<string> AvatarExtensions = new()
        {
            ".jpg",
            ".png",
            ".gif"
        };

        public static readonly List<string> AllowedMimeTypes = new()
        {
            "image/jpeg",
            "image/png",
            "image/gif",
            "application/pdf",
            "application/msword",
            "application/vnd.ms-excel",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        };
    }
}
