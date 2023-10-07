import "react-quill/dist/quill.snow.css";
import "react-multi-carousel/lib/styles.css";
import TaskPreview from "../components/TaskPreview";
import CustomTab from "../components/common/CustomTab";
import { IoCreateOutline, IoAddCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import ProjectPreview from "../components/ProjectPreview";
import { PathString } from "../enums/MapRouteToBreadCrumb";
import { Role } from "../enums/role";
import useCurrentPerson from "../hooks/store/useCurrentPerson";
import JobFilterSection from "../components/common/JobFilterSection";

interface IFinishedProjects {
  isInternal?: boolean;
}
const FinishedProjects: React.FC<IFinishedProjects> = ({ isInternal }) => {
  const navigate = useNavigate();
  const currentPerson = useCurrentPerson();
  return (
    <>
      <div className="h-full overflow-auto scrollbar-hide">
        <div className="mb-10">
          <div className="flex items-end justify-between gap-3">
            <JobFilterSection finishedOnly isInternal={isInternal} />
            {currentPerson.roleType !== Role.DESIGNER && (
              <div
                onClick={() => navigate(`/${PathString.VIEC_DA_XONG}/${PathString.THEM_MOI}`)}
                className="flex h-10 w-20 cursor-pointer items-center justify-center gap-2 rounded-md bg-accent p-3 text-white hover:opacity-75 3xl:w-auto"
              >
                <IoAddCircleOutline size={20} className="text-white" />
                <span className="hidden 3xl:block">Tạo công việc mới</span>
              </div>
            )}
          </div>
        </div>
        <p className="text-primary mb-6 text-base">Dự án đã hoàn thành</p>
        <div className="grid grid-cols-20 items-start gap-2">
          <div className="col-span-full overflow-hidden p-1 pb-20 ">
            <ProjectPreview finishedOnly />
          </div>
        </div>
      </div>
    </>
  );
};

export default FinishedProjects;
