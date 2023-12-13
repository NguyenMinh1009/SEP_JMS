import React from "react";
import { MdOutlineClose, MdOutlineDone, MdOutlineHourglassFull } from "react-icons/md";
import { ITaskPropertiesLabel } from "../../../interface/ITaskPropertiesLabel";
import { Priority } from "../../../enums/priority";
import { JobStatusType } from "../../../enums/jobStatusType";
import { InternalJobStatusType } from "../../../enums/internalJobStatusType";
const TaskPropertiesLabel: React.FC<ITaskPropertiesLabel> = ({ type, info }) => {
  const getInfoLabel = () => {
    if (type === "statusTask") {
      switch (info) {
        case JobStatusType.Completed:
          return (
            <div className="flex items-center gap-2">
              <MdOutlineDone style={{ fill: "green", fontSize: "15px" }} />
              <span className="truncate text-green-500">Đã xong</span>
            </div>
          );
        case JobStatusType.Pending:
          return (
            <div className="flex items-center gap-2">
              <MdOutlineHourglassFull style={{ fill: "orange", fontSize: "15px" }} />
              <span className="truncate">Pending</span>
            </div>
          );
        case JobStatusType.CustomerReview:
          return (
            <div className="flex items-center gap-2">
              {/* <MdOutlineClose style={{ fill: "gray", fontSize: "15px" }} /> */}
              <span className="truncate">Chờ khách duyệt</span>
            </div>
          );
        case JobStatusType.Doing:
          return (
            <div className="flex items-center gap-2">
              {/* <MdOutlineClose style={{ fill: "gray", fontSize: "15px" }} /> */}
              <span className="truncate">Đang làm</span>
            </div>
          );
        case JobStatusType.NotDo:
          return (
            <div className="flex items-center gap-2">
              {/* <MdOutlineClose style={{ fill: "gray", fontSize: "15px" }} /> */}
              <span className="truncate">Chưa làm</span>
            </div>
          );
        default:
          return null;
      }
    }
    if (type === "prioritizeTask") {
      switch (info) {
        case Priority.HIGH:
          return (
            <div className="gap-2">
              <span className="truncate text-red-500">Cao</span>
            </div>
          );
        case Priority.MEDIUM:
          return (
            <div className="gap-2">
              <span className="truncate text-yellow-500">Vừa</span>
            </div>
          );
        default:
          return null;
      }
    }
    if (type === "assignedPerson") {
      return (
        <div className="gap-2">
          <span className="text-black-500 truncate">{info}</span>
        </div>
      );
    }
    if (type === "internalStatusTask") {
      switch (info) {
        case InternalJobStatusType.Completed:
          return (
            <div className="flex items-center gap-2">
              <MdOutlineDone style={{ fill: "green", fontSize: "15px" }} />
              <span className="truncate text-green-500">Đã xong</span>
            </div>
          );
        case InternalJobStatusType.Pending:
          return (
            <div className="flex items-center gap-2">
              <MdOutlineHourglassFull style={{ fill: "orange", fontSize: "15px" }} />
              <span className="truncate">Pending</span>
            </div>
          );
        case InternalJobStatusType.CustomerReview:
          return (
            <div className="flex items-center gap-2">
              {/* <MdOutlineClose style={{ fill: "gray", fontSize: "15px" }} /> */}
              <span className="truncate">Chờ khách duyệt</span>
            </div>
          );
        case InternalJobStatusType.Doing:
          return (
            <div className="flex items-center gap-2">
              {/* <MdOutlineClose style={{ fill: "gray", fontSize: "15px" }} /> */}
              <span className="truncate">Đang làm</span>
            </div>
          );
        case InternalJobStatusType.NotDo:
          return (
            <div className="flex items-center gap-2">
              {/* <MdOutlineClose style={{ fill: "gray", fontSize: "15px" }} /> */}
              <span className="truncate">Chưa làm</span>
            </div>
          );
        case InternalJobStatusType.InternalReview:
          return (
            <div className="flex items-center gap-2">
              {/* <MdOutlineClose style={{ fill: "gray", fontSize: "15px" }} /> */}
              <span className="truncate">Duyệt nội bộ</span>
            </div>
          );
        default:
          return null;
      }
    }
  };
  return (
    <div className="flex-shrink-0">
      <div className="flex-shrink-0 text-left " data-headlessui-state="">
        <button
          type="button"
          className="tabindex--1 border-custom-border-300 hover:bg-custom-background-80 flex w-full cursor-pointer items-center justify-between gap-1 rounded-md border px-2.5 py-1 text-xs shadow-sm duration-300 focus:outline-none "
          id="headlessui-combobox-button-:r1n:"
          aria-haspopup="listbox"
          aria-expanded="false"
          data-headlessui-state=""
        >
          <div className="tabindex-0 text-custom-text-200 flex w-full cursor-pointer items-center gap-2">
            {getInfoLabel()}
          </div>
        </button>
        <div className=""></div>
      </div>
    </div>
  );
};
export default TaskPropertiesLabel;
