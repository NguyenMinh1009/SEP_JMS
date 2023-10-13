// SubTasks.tsx
import React from "react";
import { AiOutlineEllipsis } from "react-icons/ai";
import TaskPropertiesLabel from "./TaskPropertiesLabel";
import DropdownAction from "./DropdownAction";
import { VisibleType } from "../../../enums/visibleType";

interface SubTasksProps {
  tasks: any[];
  // parentId: string;
  visibleType: VisibleType;
  // finishedOnly?: boolean;
}

const SubTasksProps: React.FC<SubTasksProps> = ({ tasks, visibleType }) => {
  return (
    <div>
      {tasks.length !== 0 ? (
        tasks.map((task, index) => (
          <div key={index} className="border-custom-border-100 border border-b-0">
            <div className="relative">
              <div>
                <div className="hover:bg-custom-background-90 border-custom-border-100 group relative flex h-full w-full items-center gap-2 border-b px-2 py-1 pl-10 transition-all">
                  <div className="flex w-full cursor-pointer items-center gap-2">
                    <div className="h-[6px] w-[6px] flex-shrink-0 rounded-full bg-blue-500"></div>
                    <div className="text-custom-text-200 flex-shrink-0 text-xs">{index + 1}</div>
                    <div className="text-custom-text-100 tabindex-0 line-clamp-1 pr-2 text-xs">
                      {task.title}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-sm">
                    <div className="relative flex items-center gap-1">
                      {/*label prioritize task */}
                      <TaskPropertiesLabel type="prioritizeTask" info={task.priority} />
                      {/*label status task */}
                      <TaskPropertiesLabel type="statusTask" info={task.jobStatus} />
                      {/*label assigned person  */}
                      <TaskPropertiesLabel type="assignedPerson" info={task.designer.fullname} />
                    </div>
                  </div>
                  {/*actions */}
                  <DropdownAction visibleType={visibleType} finishOnly subTaskId={task.jobId} />
                  {/* ---------- */}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Chưa có công việc</p>
      )}
    </div>
  );
};

export default SubTasksProps;
