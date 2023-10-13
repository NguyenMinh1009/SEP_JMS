import { useParams } from "react-router-dom";
import ProjectParentSection from "../components/ProjectManagement/SubTasks/ProjectParentSection";
import TasksDetail from "../components/TaskDetail";
import { CorrelationJobType } from "../enums/correlationJobType";

const SubTaskDetail = () => {
  const { taskId, subTaskId } = useParams();

  return (
    <div>
      {/* <ProjectParentSection /> */}
      {/* <TasksDetail isCorrelationJobType={CorrelationJobType.Job} /> */}
    </div>
  );
};
export default SubTaskDetail;
