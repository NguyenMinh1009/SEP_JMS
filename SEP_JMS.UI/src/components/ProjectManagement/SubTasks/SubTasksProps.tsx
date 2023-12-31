// SubTasks.tsx
import { CircularProgress } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { JobStatusType } from "../../../enums/jobStatusType";
import { VisibleType } from "../../../enums/visibleType";
import { recursiveStructuredClone } from "../../../utils/recursiveStructuredClone";
import DropdownAction from "./DropdownAction";
import TaskPropertiesLabel from "./TaskPropertiesLabel";
import { PathString } from "../../../enums/MapRouteToBreadCrumb";
import { useNavigate, useParams } from "react-router-dom";

interface SubTasksProps {
  tasks: any[];
  // parentId: string;
  visibleType: VisibleType;
  finishedOnly?: boolean;
}

const SubTasksProps: React.FC<SubTasksProps> = ({ tasks, visibleType, finishedOnly }) => {
  const [jobs, setJobs] = useState<any[]>(tasks);
  const { taskId } = useParams();
  const navigate = useNavigate();

  const removeSubTask = useCallback(
    (taskId: any) => {
      const updatedJobs = [...jobs];
      // Tìm index của task cần xóa
      const taskIndex = updatedJobs.findIndex(task => task.jobId === taskId);
      // Nếu tìm thấy thì xóa đi
      if (taskIndex > -1) {
        updatedJobs.splice(taskIndex, 1);
      }
      // Cập nhật lại jobs state
      setJobs(updatedJobs);
    },
    [jobs]
  );

  useEffect(() => {
    setJobs(tasks);
  }, [tasks]);

  const getLinkForViewJob = (subTaskId: any): string => {
    if (finishedOnly)
      return `/${PathString.VIEC_DA_XONG}/${PathString.VIEC_DU_AN}/${taskId}/${subTaskId}`;
    if (visibleType === VisibleType.Public)
      return `/${PathString.CONG_KHAI}/${PathString.VIEC_DU_AN}/${taskId}/${subTaskId}`;
    return `/${PathString.NOI_BO}/${PathString.VIEC_DU_AN}/${taskId}/${subTaskId}`;
  };

  const handleViewClick = (subTaskId: any) => {
    navigate(getLinkForViewJob(subTaskId));
  };

  return (
    <div>
      {jobs.map((task, index) => (
        <div key={index} className="border-custom-border-100 border border-b-0">
          <div className="relative">
            <div>
              <div className="hover:bg-custom-background-90 border-custom-border-100 group relative flex h-full w-full items-center gap-2 border-b px-2 py-1 pl-10 transition-all">
                <div className="flex w-full cursor-pointer items-center gap-2">
                  <div className="mr-3 h-[6px] w-[6px] flex-shrink-0 rounded-full bg-blue-500"></div>
                  {/* <div className="text-custom-text-200 flex-shrink-0 text-xs">{index + 1}</div> */}
                  <div
                    className="text-custom-text-100 tabindex-0 line-clamp-1 pr-2 text-xs"
                    onClick={() => handleViewClick(task.jobId)}
                  >
                    {task.title}
                  </div>
                </div>
                <div className="flex-shrink-0 text-sm">
                  <div className="relative flex items-center gap-1">
                    {/*label prioritize task */}
                    <TaskPropertiesLabel type="prioritizeTask" info={task.priority} />
                    {/*label status task */}
                    {visibleType === VisibleType.Internal ? (
                      <TaskPropertiesLabel
                        type="internalStatusTask"
                        info={task.internalJobStatus}
                      />
                    ) : (
                      <TaskPropertiesLabel type="statusTask" info={task.jobStatus} />
                    )}
                    {/*label assigned person  */}
                    <TaskPropertiesLabel
                      type="assignedPerson"
                      info={task?.designer?.fullname ?? "Còn trống"}
                    />
                  </div>
                </div>
                {/*actions */}
                {finishedOnly ? (
                  <DropdownAction
                    visibleType={visibleType}
                    subTaskId={task.jobId}
                    finishedOnly
                    isPaid={task.paymentSuccess}
                    removeSubTask={removeSubTask}
                  />
                ) : task.jobStatus === JobStatusType.Completed ? (
                  <DropdownAction
                    visibleType={visibleType}
                    subTaskId={task.jobId}
                    isPaid={task.paymentSuccess}
                    removeSubTask={removeSubTask}
                  />
                ) : (
                  <DropdownAction
                    visibleType={visibleType}
                    subTaskId={task.jobId}
                    isPaid={task.paymentSuccess}
                    removeSubTask={removeSubTask}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubTasksProps;
