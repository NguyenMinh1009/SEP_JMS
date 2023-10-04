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
interface ITaskDetailsDescriptionProps {
  taskDetail: any;
  docFiles: FileResponse[];
  imgFiles: File[];
  finalFiles?: File[];
  setFinalFiles?: React.Dispatch<React.SetStateAction<File[]>>;
  isImagesLoading: boolean;
}

const TaskDetailsDescription: React.FC<ITaskDetailsDescriptionProps> = props => {
  const { taskDetail: jobDetail, docFiles, imgFiles, isImagesLoading } = props;
  const [overflowActive, setOverflowActive] = useState<boolean>(false);
  const [isDetailExpanded, setDetailExpanded] = useState<boolean>(false);
  const overflowingText = useRef<HTMLDivElement | null>(null);

  const driveFiles = jobDetail?.finalProducts?.files ?? [];
  const previewFiles = jobDetail?.previewProducts?.files ?? [];

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

  return (
    <div className="min-h-[392px] w-full px-6 pb-8 pt-5 shadow-custom">
      <div className="flex flex-col items-start gap-2">
        <label htmlFor="" className="text-primary min-w-[75px]">
          Tên công việc
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
                    <span className="text-primary">Mô tả công việc:</span>
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
                          {!isDetailExpanded ? "Hiển thị chi tiết" : "Thu gọn"}
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
                      <span>File đính kèm</span>
                      <span className="text-[13px] font-semibold text-orange-500">
                        <i>(Click để tải về)</i>
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
                {jobDetail?.requirements?.files && jobDetail?.requirements?.files.length > 0 && (
                  <>
                    <p className="text-primary mb-4 mt-12 flex items-center gap-2">
                      <span>Ảnh đính kèm</span>
                      <span className="text-[13px] font-semibold text-orange-500">
                        <i>(Click để xem chi tiết)</i>
                      </span>
                    </p>
                    <div className="flex items-center gap-3">
                      <ImageSection imgFiles={imgFiles} />
                      {isImagesLoading && <CircularProgress size={15} className="mt-3" />}
                    </div>
                  </>
                )}
                {driveFiles && driveFiles.length > 0 && (
                  <>
                    <p className="text-primary mb-6 mt-10 flex items-center gap-2">
                      <span className="text-[13px]">File final</span>
                      <span className="text-[13px] font-semibold text-orange-500">
                        <i>(Click để tải về)</i>
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
                {previewFiles && previewFiles.length > 0 && (
                  <>
                    <p className="text-primary mb-6 mt-10 flex items-center gap-2">
                      <span className="text-[13px]">Ảnh báo cáo</span>
                      <span className="text-[13px] font-semibold text-orange-500">
                        <i>(Click để tải về)</i>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsDescription;
