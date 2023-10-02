import { Priority } from "../enums/priority";
import {
  FcMediumPriority,
  //  FcLowPriority,
  FcHighPriority
} from "react-icons/fc";

export const getTextColorFromPriority = (priority: Priority) => {
  switch (priority) {
    case Priority.HIGH:
      return "text-[#ed1b34]";
    case Priority.MEDIUM:
      return "";
    // case Priority.LOW:
    //   return "text-green-700";
  }
};

export const getPriorityIcon = (priorityKey: Priority) => {
  switch (priorityKey) {
    // case Priority.LOW:
    //   return <FcLowPriority size={15} color="#555" />;
    case Priority.MEDIUM:
      return <FcMediumPriority size={15} color="#555" />;
    case Priority.HIGH:
      return <FcHighPriority size={15} color="#555" />;
  }
};
