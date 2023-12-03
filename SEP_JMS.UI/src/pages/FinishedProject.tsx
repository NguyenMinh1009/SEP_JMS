import "react-quill/dist/quill.snow.css";
import "react-multi-carousel/lib/styles.css";
import TaskPreview from "../components/TaskPreview";
import CustomTab from "../components/common/CustomTab";
import { IoCreateOutline, IoAddCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
// import ProjectPreview from "../components/ProjectManagement/ProjectPreview";
import { PathString } from "../enums/MapRouteToBreadCrumb";
import { Role } from "../enums/role";
import useCurrentPerson from "../hooks/store/useCurrentPerson";
import JobFilterSection from "../components/common/JobFilterSection";
import { useState } from "react";
import { CorrelationJobType } from "../enums/correlationJobType";
import APIClientInstance from "../api/AxiosInstance";
import moment from "moment";
import { CircularProgress } from "@mui/material";
import { CiExport } from "react-icons/ci";
import { TaskString } from "../enums/taskEnums";
import useFilterInfo from "../hooks/store/useFilterInfo";

interface IFinishedProjects {
  isInternal?: boolean;
}
const FinishedProjects: React.FC<IFinishedProjects> = ({ isInternal }) => {
  const [pageInfo, setPageInfo] = useState<{ page: number; pageSize: number }>({
    page: 1,
    pageSize: 10
  });
  const navigate = useNavigate();
  const currentPerson = useCurrentPerson();
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const filterInfoController = useFilterInfo();

  const handleExport = () => {
    setIsExporting(true);
    filterInfoController.content.correlationType = CorrelationJobType.Project;
    APIClientInstance.post(
      "job/export",
      {
        ...pageInfo,
        ...filterInfoController.content
      },
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
    <>
      <div className="h-full overflow-auto scrollbar-hide">
        <div className="mb-10">
          <div className="flex items-end justify-between gap-3">
            <JobFilterSection finishedOnly isInternal={isInternal} />
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
                  <span className="hidden 3xl:block">{TaskString.Xuat_Tep_DU_AN}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="text-primary mb-6 text-base">{TaskString.DU_AN_DA_HOAN_THANH}</p>
        <div className="grid grid-cols-20 items-start gap-2">
          <div className="col-span-full overflow-hidden p-1 pb-20 ">
            <TaskPreview
              setPageInfo={setPageInfo}
              finishedOnly
              isCorrelationJobType={CorrelationJobType.Project}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FinishedProjects;
