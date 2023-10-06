import React from "react";
import { MdOutlineClose, MdOutlineDone, MdOutlineHourglassFull } from "react-icons/md";
import { ITaskPropertiesLabel } from "../../interface/ITaskPropertiesLabel";
const TaskPropertiesLabel: React.FC<ITaskPropertiesLabel> = ({ type, statusType }) => {
  const getInfoLabel = () => {
    if (type === "statusTask") {
      switch (statusType) {
        case "Done":
          return (
            <div className="flex items-center gap-2">
              <MdOutlineDone style={{ fill: "green", fontSize: "15px" }} />
              <span className="truncate">Done</span>
            </div>
          );
        case "Pending":
          return (
            <div className="flex items-center gap-2">
              <MdOutlineHourglassFull style={{ fill: "orange", fontSize: "15px" }} />
              <span className="truncate">Pending</span>
            </div>
          );
        case "Close":
          return (
            <div className="flex items-center gap-2">
              <MdOutlineClose style={{ fill: "gray", fontSize: "15px" }} />
              <span className="truncate">Close</span>
            </div>
          );
        default:
          return null;
      }
    }
    if (type === "prioritizeTask") {
      switch (statusType) {
        case "High":
          return (
            <div className="gap-2">
              <span className="truncate text-red-500">High</span>
            </div>
          );
        case "Low":
          return (
            <div className="gap-2">
              <span className="truncate text-yellow-500">Low</span>
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
