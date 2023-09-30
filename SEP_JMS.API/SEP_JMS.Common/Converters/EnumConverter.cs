using SEP_JMS.Model.Enums.System;

namespace SEP_JMS.Common.Converters
{
    public static class EnumConverter
    {
        public static InternalJobStatus ToInternalJobStatus(this JobStatus status)
        {
            return status switch
            {
                JobStatus.NotDo => InternalJobStatus.NotDo,
                JobStatus.Doing => InternalJobStatus.Doing,
                JobStatus.CustomerReview => InternalJobStatus.CustomerReview,
                JobStatus.Completed => InternalJobStatus.Completed,
                JobStatus.Pending => InternalJobStatus.Pending,
                _ => InternalJobStatus.NotDo,
            };
        }

        public static JobStatus ToJobStatus(this InternalJobStatus status)
        {
            return status switch
            {
                InternalJobStatus.NotDo => JobStatus.NotDo,
                InternalJobStatus.Doing => JobStatus.Doing,
                InternalJobStatus.InternalReview => JobStatus.Doing,
                InternalJobStatus.CustomerReview => JobStatus.CustomerReview,
                InternalJobStatus.Completed => JobStatus.Completed,
                InternalJobStatus.Pending => JobStatus.Pending,
                _ => JobStatus.NotDo,
            };
        }
    }
}
