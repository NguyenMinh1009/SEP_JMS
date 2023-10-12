import "react-quill/dist/quill.snow.css";
import { CorrelationJobType } from "../enums/correlationJobType";
import { VisibleType } from "../enums/visibleType";
import CreateTask from "../components/common/CreateTask";

interface ICreatePageProps {
  isInternal?: boolean;
  isCorrelationJobType: number;
}

const Home: React.FC<ICreatePageProps> = ({ isInternal, isCorrelationJobType }) => {
  return (
    <>
      {isCorrelationJobType === CorrelationJobType.Project ? (
        <p className="text-primary mb-6 text-base">Tạo mới dự án</p>
      ) : (
        <p className="text-primary mb-6 text-base">Tạo mới công việc</p>
      )}
      <CreateTask
        visibleType={isInternal ? VisibleType.Internal : VisibleType.Public}
        correlationJobType={isCorrelationJobType}
        label="Tạo việc mới"
      />
    </>
  );
};

export default Home;
