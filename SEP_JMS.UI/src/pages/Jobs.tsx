import "react-quill/dist/quill.snow.css";
import "react-multi-carousel/lib/styles.css";
import TaskPreview from "../components/TaskPreview";
import InternalTaskPreview from "../components/InternalTaskPreview";
// import CustomTab from "../components/common/CustomTab";
import { IoAddCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { PathString } from "../enums/MapRouteToBreadCrumb";
import { Role } from "../enums/role";
import useCurrentPerson from "../hooks/store/useCurrentPerson";
import JobFilterSection from "../components/common/JobFilterSection";
import { CorrelationJobType } from "../enums/correlationJobType";

interface IJobs {
  isInternal?: boolean;
  isCorrelationJobType: number;
}
const Jobs: React.FC<IJobs> = ({ isInternal, isCorrelationJobType }) => {
  const navigate = useNavigate();
  const currentPerson = useCurrentPerson();
  return (
    <div className="h-full overflow-auto scrollbar-hide">
      <div className="mb-10">
        <div className="flex items-end justify-between gap-3">
          <JobFilterSection isInternal={isInternal} isCorrelationJobType={isCorrelationJobType} />
          {currentPerson.roleType !== Role.DESIGNER && (
            <div
              onClick={() => {
                switch (isInternal || false) {
                  case true:
                    {
                      isCorrelationJobType === CorrelationJobType.Project
                        ? navigate(
                            `/${PathString.NOI_BO}/${PathString.VIEC_DU_AN}/${PathString.THEM_MOI}`
                          )
                        : navigate(
                            `/${PathString.NOI_BO}/${PathString.VIEC_HANG_NGAY}/${PathString.THEM_MOI}`
                          );
                    }
                    break;
                  case false:
                    {
                      isCorrelationJobType === CorrelationJobType.Project
                        ? navigate(
                            `/${PathString.CONG_KHAI}/${PathString.VIEC_DU_AN}/${PathString.THEM_MOI}`
                          )
                        : navigate(
                            `/${PathString.CONG_KHAI}/${PathString.VIEC_HANG_NGAY}/${PathString.THEM_MOI}`
                          );
                    }
                    break;

                  default:
                    break;
                }
              }}
              className="flex h-10 w-20 cursor-pointer items-center justify-center gap-2 rounded-md bg-accent p-3 text-white hover:opacity-75 3xl:w-auto"
            >
              <IoAddCircleOutline size={20} className="text-white" />
              <span className="hidden 3xl:block">Tạo công việc mới</span>
            </div>
          )}
        </div>
      </div>
      <p className="text-primary mb-6 text-base">Danh sách công việc</p>
      <div className="grid grid-cols-20 items-start gap-2">
        <div className="col-span-full overflow-hidden p-1 pb-20 ">
          {isInternal ? (
            isCorrelationJobType === CorrelationJobType.Job ? (
              <InternalTaskPreview isCorrelationJobType={CorrelationJobType.Job} />
            ) : (
              <InternalTaskPreview isCorrelationJobType={CorrelationJobType.Project} />
            )
          ) : isCorrelationJobType === CorrelationJobType.Job ? (
            <TaskPreview isCorrelationJobType={CorrelationJobType.Job} />
          ) : (
            <TaskPreview isCorrelationJobType={CorrelationJobType.Project} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
