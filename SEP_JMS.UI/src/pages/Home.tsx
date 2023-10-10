import "react-quill/dist/quill.snow.css";
import { CorrelationJobType } from "../enums/correlationJobType";
import { VisibleType } from "../enums/visibleType";
import CreateTask from "../components/common/CreateTask";

interface ICreatePageProps {
  isInternal?: boolean;
}

const Home: React.FC<ICreatePageProps> = ({ isInternal }) => {
  return (
    <>
      <p className="text-primary mb-6 text-base">Tạo mới công việc</p>
      <CreateTask
        visibleType={isInternal ? VisibleType.Internal : VisibleType.Public}
        correlationJobType={CorrelationJobType.Job}
        label="Tạo việc mới"
      />
    </>
  );
};

export default Home;
