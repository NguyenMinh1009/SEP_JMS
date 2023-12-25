import React, { useEffect, useRef, useState } from "react";
import FileSection from "./FileSection";
import { VisibleType } from "../enums/visibleType";
import { CorrelationJobType } from "../enums/correlationJobType";
import mime from "mime";
import ImageSection from "./common/ImageSection";
import { MdOutlineExpandCircleDown } from "react-icons/md";
import { checkOverflow } from "../utils/checkOverFlow";
import { FileResponse } from "../interface/fileResponse";
import { CircularProgress } from "@mui/material";
import { PostType } from "../enums/postType";
import { useNavigate, useParams } from "react-router-dom";
import APIClientInstance from "../api/AxiosInstance";
import { TaskString } from "../enums/taskEnums";
import useCurrentPerson from "../hooks/store/useCurrentPerson";
import { Role } from "../enums/Role";
import { JobStatusType } from "../enums/jobStatusType";
import { InternalJobStatusType } from "../enums/internalJobStatusType";
interface ITaskDetailsDescriptionProps {
  taskDetail: any;
  docFiles: FileResponse[];
  imgFiles: File[];
  finalFiles?: File[];
  setFinalFiles?: React.Dispatch<React.SetStateAction<File[]>>;
  isImagesLoading: boolean;
  jobParentTitle?: string;
  isCorrelationJobType?: number;
}

const TaskDetailsDescription: React.FC<ITaskDetailsDescriptionProps> = props => {
  const {
    taskDetail: jobDetail,
    docFiles,
    imgFiles,
    isImagesLoading,
    jobParentTitle,
    isCorrelationJobType
  } = props;
  const [overflowActive, setOverflowActive] = useState<boolean>(false);
  const [isDetailExpanded, setDetailExpanded] = useState<boolean>(false);
  const overflowingText = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const driveFiles = jobDetail?.finalProducts?.files ?? [];
  const previewFiles = jobDetail?.previewProducts?.files ?? [];

  const titleProject = jobParentTitle ? jobParentTitle : TaskString.EMPTY;
  const currentPerson = useCurrentPerson();

  useEffect(() => {
    if (checkOverflow(overflowingText.current)) {
      setOverflowActive(true);
      return;
    }
    setOverflowActive(false);
  }, [
    overflowActive,
    isDetailExpanded,
    jobDetail,
    overflowingText?.current?.offsetHeight,
    overflowingText?.current?.scrollHeight,
    imgFiles
  ]);

  const gotoProject = () => {
    const ahref = location.pathname.split("/").slice(1);
    navigate("/" + ahref.slice(0, ahref.length - 1).join("/"));
  };

  const renderJobParentTitle = () => {
    if (titleProject !== TaskString.EMPTY)
      return (
        <div className="flex flex-col items-start gap-2 pb-5">
          <label htmlFor="" className="text-primary min-w-[75px]">
            {TaskString.TEN_DU_AN}
          </label>
          <p
            className="w-full cursor-pointer rounded-md font-semibold leading-5 text-blue-500"
            onClick={gotoProject}
          >
            {titleProject}
          </p>
        </div>
      );
  };

  const renderFinalFiles = () => {
    if (
      currentPerson.roleType !== Role.CUSTOMER ||
      (currentPerson.roleType === Role.CUSTOMER &&
        (jobDetail?.jobStatus === JobStatusType.CustomerReview ||
          jobDetail?.internalJobStatus === InternalJobStatusType.CustomerReview ||
          jobDetail?.jobStatus === JobStatusType.Completed))
    )
      return (
        <>
          {driveFiles && driveFiles.length > 0 && (
            <>
              <p className="text-primary mb-6 mt-10 flex items-center gap-2">
                <span className="text-[13px]">{TaskString.SAN_PHAM}</span>
                <span className="text-[13px] font-semibold text-orange-500">
                  <i>{TaskString.CLICK_DE_TAI_VE}</i>
                </span>
              </p>
              <FileSection
                postType={PostType.final}
                visibleType={VisibleType.Public}
                remoteFileList={driveFiles?.map((file: any) => ({
                  name: file.fileName,
                  originalName: file.originalName
                }))}
              />
            </>
          )}
        </>
      );
  };

  const renderPreviewFiles = () => {
    if (
      currentPerson.roleType !== Role.CUSTOMER ||
      (currentPerson.roleType === Role.CUSTOMER &&
        (jobDetail?.jobStatus === JobStatusType.CustomerReview ||
          jobDetail?.internalJobStatus === InternalJobStatusType.CustomerReview ||
          jobDetail?.jobStatus === JobStatusType.Completed))
    )
      return (
        <>
          {previewFiles && previewFiles.length > 0 && (
            <>
              <p className="text-primary mb-6 mt-10 flex items-center gap-2">
                <span className="text-[13px]">{TaskString.ANH_BAO_CAO}</span>
                <span className="text-[13px] font-semibold text-orange-500">
                  <i>{TaskString.CLICK_DE_TAI_VE}</i>
                </span>
              </p>
              <FileSection
                postType={PostType.preview}
                visibleType={VisibleType.Public}
                remoteFileList={previewFiles?.map((file: any) => ({
                  name: file.fileName,
                  originalName: file.originalName
                }))}
              />
            </>
          )}
        </>
      );
  };

  return (
    <div className="min-h-[392px] w-full px-6 pb-8 pt-5 shadow-custom">
      {renderJobParentTitle()}
      <div className="flex flex-col items-start gap-2">
        <label htmlFor="" className="text-primary min-w-[75px]">
          {isCorrelationJobType === CorrelationJobType.Project
            ? TaskString.TEN_DU_AN
            : TaskString.TEN_CONG_VIEC}
        </label>
        <p className="w-full rounded-md leading-5">{jobDetail?.title}</p>
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="common-border flex-1 overflow-auto pt-3 scrollbar-hide">
          <div className="h-fit">
            <div className="rounded-md py-4">
              <div className="break-word text-comment-container grow-0">
                <div className="mb-1 flex flex-col gap-2">
                  <div className="flex flex-1 items-center justify-between gap-2">
                    {/* <BiInfoCircle size={15} color="#333" /> */}
                    <span className="text-primary">
                      {isCorrelationJobType === CorrelationJobType.Project
                        ? TaskString.MO_TA_DU_AN
                        : TaskString.MO_TA_CONG_VIEC}
                    </span>
                    <div
                      onClick={() => setDetailExpanded(!isDetailExpanded)}
                      className="flex cursor-pointer items-center gap-1 text-[#0655a7] hover:opacity-75"
                    >
                      <MdOutlineExpandCircleDown
                        size={16}
                        color="#0655a7"
                        className={!isDetailExpanded ? "" : "rotate-180"}
                      />
                      <p>
                        <i className="text-[13px] font-[500]">
                          {!isDetailExpanded
                            ? `${TaskString.HIEN_THI_CHI_TIET}`
                            : `${TaskString.THU_GON}`}
                        </i>
                      </p>
                    </div>
                  </div>
                  <div className="relative -mt-3">
                    <div
                      ref={overflowingText}
                      className={`relative mb-3 transition-all ${
                        isDetailExpanded ? "max-h-none" : "max-h-[200px]"
                      } overflow-hidden leading-9`}
                      dangerouslySetInnerHTML={{
                        __html: jobDetail?.description
                      }}
                    ></div>
                    {!isDetailExpanded && overflowActive && (
                      <div className="job-content-container-overlay pointer-events-none absolute inset-0" />
                    )}
                  </div>
                </div>
                {docFiles && docFiles.length > 0 && (
                  <>
                    <p className="text-primary mb-6 mt-10 flex items-center gap-2">
                      <span>{TaskString.TAI_LIEU_DINH_KEM}</span>
                      <span className="text-[13px] font-semibold text-orange-500">
                        <i>{TaskString.CLICK_DE_TAI_VE}</i>
                      </span>
                    </p>
                    <FileSection
                      visibleType={VisibleType.Public}
                      remoteFileList={docFiles.map(file => ({
                        name: file.fileName,
                        type: file.mimeType,
                        originalName: file.originalName
                      }))}
                    />
                  </>
                )}
                {jobDetail?.requirements?.files &&
                  jobDetail?.requirements?.files.length > 0 &&
                  imgFiles.length > 0 && (
                    <>
                      <p className="text-primary mb-4 mt-12 flex items-center gap-2">
                        <span>{TaskString.ANH_DINH_KEM}</span>
                        <span className="text-[13px] font-semibold text-orange-500">
                          <i>{TaskString.CLICK_DE_TAI_VE}</i>
                        </span>
                      </p>
                      <div className="flex items-center gap-3">
                        <ImageSection imgFiles={imgFiles} />
                        {isImagesLoading && <CircularProgress size={15} className="mt-3" />}
                      </div>
                    </>
                  )}
                {renderFinalFiles()}
                {renderPreviewFiles()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsDescription;
