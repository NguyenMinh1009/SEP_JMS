namespace SEP_JMS.Common.Constants
{
    public class PolicyConstants
    {
        public const string CreateJob = "CreateJob";
        public const string Internal = "Internal";
        public const string Assign = "Assign";
        public const string AccountAndDesigner = "AccountAndDesigner";

        public const string Admin = "Admin";
        public const string Customer = "Customer";
        public const string Account = "Account";
        public const string Designer = "Designer";

        public const long maxFileSizeDrive = 10L * 1024L * 1024L * 1024L; //10GB
        public const long commentFileSize = 50L * 1024L * 1024L; //50MB
        public const long requirementFileSize = 100L * 1024L * 1024L; //100MB
        public const long previewFileSize = 5 * 1024L * 1024L; //1MB
    }
}
