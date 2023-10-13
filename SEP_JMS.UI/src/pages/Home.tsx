import "react-quill/dist/quill.snow.css";
import { CorrelationJobType } from "../enums/correlationJobType";
import { VisibleType } from "../enums/visibleType";
import CreateTask from "../components/common/CreateTask";
import CreateSubTask from "../components/ProjectManagement/SubTasks/CreateSubTask";
import { useParams } from "react-router-dom";

interface ICreatePageProps {
  isInternal?: boolean;
  isCorrelationJobType: number;
  isParentId?: boolean;
}

const Home: React.FC<ICreatePageProps> = ({ isInternal, isCorrelationJobType, isParentId }) => {
  const { taskId } = useParams();

  return (
    <>
      {isCorrelationJobType === CorrelationJobType.Project ? (
        <p className="text-primary mb-6 text-base">Tạo mới dự án</p>
      ) : (
        <p className="text-primary mb-6 text-base">Tạo mới công việc</p>
      )}
      {isParentId ? (
        <CreateSubTask
          visibleType={isInternal ? VisibleType.Internal : VisibleType.Public}
          correlationJobType={isCorrelationJobType}
          label="Tạo việc mới của dự án"
          parentId={taskId}
        />
      ) : (
        <CreateTask
          visibleType={isInternal ? VisibleType.Internal : VisibleType.Public}
          correlationJobType={isCorrelationJobType}
          label="Tạo việc mới"
        />
      )}
    </>
  );
};

export default Home;
