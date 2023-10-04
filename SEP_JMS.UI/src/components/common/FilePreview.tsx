import React, { useState } from "react";
import { RiCloseCircleFill, RiFileExcel2Fill } from "react-icons/ri";
import { RiFileWord2Fill } from "react-icons/ri";
import { RiFilePpt2Fill } from "react-icons/ri";
import { RiFile2Fill } from "react-icons/ri";
import { IoImage } from "react-icons/io5";
import { fileType } from "../FileSection";
import AlwayxInstance from "../../api/AxiosInstance";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { PostType } from "../../enums/postType";
import { getLinkForJobType } from "../../utils/CorrelationJobType";
import { VisibleType } from "../../enums/visibleType";

interface IFileTypeProps {
  filetype: fileType;
  size?: number;
  name: string;
  postType?: PostType;
  commentId?: string;
  mainTaskId?: string;
  visibleType: VisibleType;
  index: number;
  handleDelete?: (name: string) => void;
  originalName?: string;
}

const FilePreview: React.FC<IFileTypeProps> = ({
  filetype,
  size,
  name,
  postType,
  commentId,
  mainTaskId,
  visibleType,
  index,
  handleDelete,
  originalName
}) => {
  const isRemoteFile: boolean = size ? false : true;
  const [isLoading, setLoading] = useState<boolean>(false);
  const { taskId } = useParams();

  const handleClickFile = (e: any) => {
    if (!isRemoteFile) return;
    if (!isLoading) {
      setLoading(true);
      AlwayxInstance.post(
        `${getLinkForJobType(visibleType)}${mainTaskId ? mainTaskId : taskId}`,
        {
          commentId: commentId,
          fileName: name,
          postsType: postType ?? PostType.post
        },
        { responseType: "blob" }
      )
        .then((response: any) => {
          const docFile = new File([response.data], name, { type: response.data.type });
          const fileLink = document.createElement("a");
          fileLink.href = URL.createObjectURL(docFile);
          fileLink.setAttribute("download", originalName ?? "");
          fileLink.click();
        })
        .catch(err => err)
        .finally(() => setLoading(false));
    }
  };
  const renderFileIcon: () => JSX.Element = () => {
    switch (filetype) {
      case "doc":
        return <RiFileWord2Fill size={16} color="#0054a6" />;
      case "ppt":
        return <RiFilePpt2Fill size={16} color="orange" />;
      case "excel":
        return <RiFileExcel2Fill size={16} color="green" />;
      case "others":
        return <RiFile2Fill size={16} color="#CBD5E1" />;
      case "image":
        return <IoImage size={16} color="#888" />;
    }
  };
  return (
    <div
      onClick={handleClickFile}
      className="group relative flex cursor-pointer items-center justify-between gap-2"
    >
      {isLoading && (
        <div className="absolute -left-4 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center">
          <CircularProgress size={12} />
        </div>
      )}
      <div className="flex w-[calc(100%-35px)] shrink-0 grow-0 items-center gap-2">
        {handleDelete && (
          <div className="h-4 w-0 cursor-pointer rounded-full bg-[#ffffff99] opacity-0 transition-all group-hover:mr-1 group-hover:w-4 group-hover:opacity-100">
            <RiCloseCircleFill
              onClick={e => {
                e.stopPropagation();
                handleDelete(name);
              }}
              size={20}
              className="text-[#666] transition-all hover:opacity-70"
            />
          </div>
        )}
        <div className="mt-[2px]">{renderFileIcon()}</div>
        <div className="mt-1 flex w-4/5 shrink-0 grow-0 flex-col items-start gap-1">
          <p className="text-primary w-full shrink-0 grow-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium">
            {index + 1 + ". " + (originalName ?? name)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
