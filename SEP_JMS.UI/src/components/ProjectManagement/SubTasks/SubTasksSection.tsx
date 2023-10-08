import React, { useState } from "react";
import SubTasks from "./SubTasksProps";
import { Button } from "@mui/material";
const SubTasksSection: React.FC = () => {
  const [showSubTasks, setShowSubTasks] = useState(false);

  const tasks = ["Task 1", "Task 2", "Task 3"]; // Thay đổi thành danh sách task của bạn

  return (
    <div>
      <Button
        className="border-custom-border-100 hover:bg-custom-background-80 flex h-8 cursor-pointer select-none items-center gap-1 rounded border p-1.5 px-2 text-xs font-medium normal-case text-black shadow transition-all "
        onClick={() => setShowSubTasks(!showSubTasks)}
      >
        Sub Tasks
      </Button>

      {showSubTasks && <SubTasks tasks={tasks} />}
    </div>
  );
};

export default SubTasksSection;
