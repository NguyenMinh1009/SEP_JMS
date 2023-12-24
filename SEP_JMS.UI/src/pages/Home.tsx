import "react-quill/dist/quill.snow.css";
import { CorrelationJobType } from "../enums/correlationJobType";
import { VisibleType } from "../enums/visibleType";
import CreateTask from "../components/common/CreateTask";
import CreateSubTask from "../components/ProjectManagement/SubTasks/CreateSubTask";
import { useParams } from "react-router-dom";
import { TaskString } from "../enums/taskEnums";

interface ICreatePageProps {
  isInternal?: boolean;
  isCorrelationJobType: number;
  isParentId?: boolean;
  finishedOnly?: boolean;
}

const Home: React.FC<ICreatePageProps> = ({
  isInternal,
  isCorrelationJobType,
  isParentId,
  finishedOnly
}) => {
  const { taskId } = useParams();

  return (
    <>
      {isCorrelationJobType === CorrelationJobType.Project ? (
        <p className="text-primary mb-6 text-base">Tạo mới dự án</p>
      ) : (
        <p className="text-primary mb-6 text-base">Tạo mới công việc</p>
      )}
      {isParentId ? (
        // viec dang lam, tao sub ttask
        <CreateSubTask
          visibleType={isInternal ? VisibleType.Internal : VisibleType.Public}
          correlationJobType={isCorrelationJobType}
          label={TaskString.TAO_VIEC_MOI_CUA_DU_AN}
          parentId={taskId}
        />
      ) : (
        <CreateTask
          visibleType={isInternal ? VisibleType.Internal : VisibleType.Public}
          correlationJobType={isCorrelationJobType}
          label={
            isCorrelationJobType === CorrelationJobType.Project
              ? TaskString.TAO_DU_AN
              : TaskString.TAO_CONG_VIEC
          }
        />
      )}
    </>
  );
};

export default Home;
