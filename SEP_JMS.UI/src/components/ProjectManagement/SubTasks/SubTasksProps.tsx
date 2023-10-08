// SubTasks.tsx
import React from "react";
import { AiOutlineEllipsis } from "react-icons/ai";
import TaskPropertiesLabel from "./TaskPropertiesLabel";
import DropdownAction from "./DropdownAction";

interface SubTasksProps {
  tasks: string[];
}

const SubTasks: React.FC<SubTasksProps> = ({ tasks }) => {
  return (
    // <ul>
    //   {tasks.map((task, index) => (
    //     <li key={index}>{task}</li>
    //   ))}
    // </ul>
    <div className="border-custom-border-100 border border-b-0">
      <div className="relative">
        <div>
          <div className="hover:bg-custom-background-90 border-custom-border-100 group relative flex h-full w-full items-center gap-2 border-b px-2 py-1 pl-10 transition-all">
            <div className="flex w-full cursor-pointer items-center gap-2">
              <div className="h-[6px] w-[6px] flex-shrink-0 rounded-full bg-green-500"></div>
              <div className="text-custom-text-200 flex-shrink-0 text-xs">1</div>
              <div className="text-custom-text-100 tabindex-0 line-clamp-1 pr-2 text-xs">minh</div>
            </div>
            <div className="flex-shrink-0 text-sm">
              <div className="relative flex items-center gap-1">
                {/*label prioritize task */}
                <TaskPropertiesLabel type="prioritizeTask" statusType="High" />
                {/*label status task */}
                <TaskPropertiesLabel type="statusTask" statusType="Done" />
                <div className="flex-shrink-0">
                  <div className="flex-shrink-0 text-left " data-headlessui-state="">
                    <button
                      type="button"
                      className="tabindex-0 hover:bg-custom-background-80 flex w-full cursor-pointer items-center justify-between gap-1 text-xs "
                      id="headlessui-combobox-button-:r1p:"
                      aria-haspopup="listbox"
                      aria-expanded="false"
                      data-headlessui-state=""
                    >
                      <div className="tabindex-0 text-custom-text-200 flex w-full cursor-pointer items-center gap-2">
                        <span className="border-custom-border-300 flex w-full items-center justify-between gap-1 rounded-md border px-2.5 py-1 text-xs shadow-sm duration-300 focus:outline-none ">
                          <span className="material-symbols-rounded text-sm text-sm font-light !leading-4 leading-5">
                            person
                          </span>
                        </span>
                      </div>
                    </button>
                    <div className=""></div>
                  </div>
                </div>
              </div>
            </div>
            {/*actions */}
            <DropdownAction />
            {/* ---------- */}
          </div>
        </div>
        <div>
          <div className="hover:bg-custom-background-90 border-custom-border-100 group relative flex h-full w-full items-center gap-2 border-b px-2 py-1 pl-10 transition-all">
            <div className="flex w-full cursor-pointer items-center gap-2">
              <div className="h-[6px] w-[6px] flex-shrink-0 rounded-full bg-green-500"></div>
              <div className="text-custom-text-200 flex-shrink-0 text-xs">2</div>
              <div className="text-custom-text-100 tabindex-0 line-clamp-1 pr-2 text-xs">
                đẹp trai
              </div>
            </div>
            <div className="flex-shrink-0 text-sm">
              <div className="relative flex items-center gap-1">
                {/*label prioritize task */}
                <TaskPropertiesLabel type="prioritizeTask" statusType="Low" />
                {/*label status task */}
                <TaskPropertiesLabel type="statusTask" statusType="Close" />
                <div className="flex-shrink-0">
                  <div className="flex-shrink-0 text-left " data-headlessui-state="">
                    <button
                      type="button"
                      className="tabindex-0 hover:bg-custom-background-80 flex w-full cursor-pointer items-center justify-between gap-1 text-xs "
                      id="headlessui-combobox-button-:r1p:"
                      aria-haspopup="listbox"
                      aria-expanded="false"
                      data-headlessui-state=""
                    >
                      <div className="tabindex-0 text-custom-text-200 flex w-full cursor-pointer items-center gap-2">
                        <span className="border-custom-border-300 flex w-full items-center justify-between gap-1 rounded-md border px-2.5 py-1 text-xs shadow-sm duration-300 focus:outline-none ">
                          <span className="material-symbols-rounded text-sm text-sm font-light !leading-4 leading-5">
                            person
                          </span>
                        </span>
                      </div>
                    </button>
                    <div className=""></div>
                  </div>
                </div>
              </div>
            </div>
            {/*actions */}
            <DropdownAction />
            {/* ---------- */}
          </div>
        </div>
      </div>
    </div>
    // ------------------------------------------
  );
};

export default SubTasks;
