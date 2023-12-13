import "react-quill/dist/quill.snow.css";
import "react-multi-carousel/lib/styles.css";
import { IoAddCircleOutline } from "react-icons/io5";
import TaskPreview from "../components/TaskPreview";
import { CiExport } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { Role } from "../enums/role";
import useCurrentPerson from "../hooks/store/useCurrentPerson";
import { useState } from "react";
import { CircularProgress } from "@mui/material";
import moment from "moment";
import { PathString } from "../enums/MapRouteToBreadCrumb";
import JobFilterSection from "../components/common/JobFilterSection";
import useFilterInfo from "../hooks/store/useFilterInfo";
import AlwayxInstance from "../api/AxiosInstance";
import { CorrelationJobType } from "../enums/correlationJobType";
import { TaskString } from "../enums/taskEnums";

interface IFinishedTasks {
  isInternal?: boolean;
}
const FinishedTasks: React.FC<IFinishedTasks> = ({ isInternal }) => {
  const [pageInfo, setPageInfo] = useState<{ page: number; pageSize: number }>({
    page: 1,
    pageSize: 10
  });
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const navigate = useNavigate();
  const currentPerson = useCurrentPerson();
  const filterInfoController = useFilterInfo();

  const handleExport = () => {
    setIsExporting(true);
    filterInfoController.content.correlationType = CorrelationJobType.Job;
    AlwayxInstance.post(
      "job/export",
      { ...pageInfo, ...filterInfoController.content },
      { responseType: "blob" }
    )
      .then(response => {
        const docFile = new File(
          [response.data],
          "Export " + moment(new Date()).format("DD-MM-YYYY - hhhmm"),
          {
            type: response.data.type
          }
        );
        const fileLink = document.createElement("a");
        fileLink.href = URL.createObjectURL(docFile);
        fileLink.setAttribute(
          "download",
          "Export " + moment(new Date()).format("DD-MM-YYYY - hgmm")
        );
        fileLink.click();
      })
      .finally(() => {
        setIsExporting(false);
      });
  };

  return (
    <div className="h-full overflow-auto scrollbar-hide">
      <div className="mb-10">
        <div className="flex items-end justify-between gap-3">
          <JobFilterSection
            finishedOnly
            isInternal={isInternal}
            isCorrelationJobType={CorrelationJobType.Job}
          />
          <div className="flex flex-col gap-11">
            {currentPerson.roleType === Role.ADMIN && (
              <div
                onClick={isExporting ? undefined : handleExport}
                className="flex h-10 w-20 cursor-pointer items-center justify-center gap-2 rounded-md bg-amber-600 p-3 text-white hover:opacity-75 3xl:w-auto"
              >
                {isExporting ? (
                  <CircularProgress size={16} className="text-white" />
                ) : (
                  <CiExport size={16} className="text-white" />
                )}
                <span className="hidden 3xl:block">{TaskString.Xuat_Tep_CONG_VIEC}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="text-primary mb-6 text-base">{TaskString.CONG_VIEC_DA_HOAN_THANH}</p>
      <div className="grid grid-cols-20 items-start gap-2">
        <div className="col-span-full overflow-hidden p-1 pb-20 ">
          <TaskPreview
            setPageInfo={setPageInfo}
            finishedOnly
            isCorrelationJobType={CorrelationJobType.Job}
          />
        </div>
      </div>
    </div>
  );
};

export default FinishedTasks;
