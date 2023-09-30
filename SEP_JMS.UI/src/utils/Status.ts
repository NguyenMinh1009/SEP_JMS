import { InternalJobStatusType } from "../enums/internalJobStatusType";
import { JobStatusType } from "../enums/jobStatusType";
import { VisibleType } from "../enums/visibleType";

export const getStatusBgColor = (selectedStatus: number, visibleType?: VisibleType): string => {
  if (visibleType === VisibleType.Public) {
    switch (selectedStatus) {
      case JobStatusType.NotDo:
        return "bg-blue-800";
      case JobStatusType.Doing:
        return "bg-orange-400";
      case JobStatusType.CustomerReview:
        return "bg-yellow-500";
      case JobStatusType.Completed:
        return "bg-green-700";
      case JobStatusType.Pending:
        return "bg-gray-400";
      default:
        return "bg-blue-800";
    }
  } else {
    switch (selectedStatus) {
      case InternalJobStatusType.NotDo:
        return "bg-blue-800";
      case InternalJobStatusType.Doing:
        return "bg-orange-400";
      case InternalJobStatusType.CustomerReview:
        return "bg-yellow-500";
      case InternalJobStatusType.Completed:
        return "bg-green-700";
      case InternalJobStatusType.Pending:
        return "bg-gray-400";
      case InternalJobStatusType.InternalReview:
        return "bg-purple-800";
      default:
        return "bg-blue-800";
    }
  }
};

export const getStatusTextColor = (selectedStatus: number): string => {
  switch (selectedStatus) {
    case JobStatusType.NotDo:
      return "text-blue-800";
    case JobStatusType.Doing:
      return "text-orange-400";
    case JobStatusType.CustomerReview:
      return "text-yellow-500";
    case JobStatusType.Completed:
      return "text-green-700";
    case JobStatusType.Pending:
      return "text-gray-400";
    case InternalJobStatusType.CustomerReview:
      return "text-purple-800";
    default:
      return "";
  }
};
