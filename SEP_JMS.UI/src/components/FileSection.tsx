import mime from "mime";
import { PostType } from "../enums/postType";
import { VisibleType } from "../enums/visibleType";
import FilePreview from "./common/FilePreview";

interface IFileSectionProps {
  fileList?: File[];
  remoteFileList?: {
    name: string;
    type?: string;
    originalName?: string;
  }[];
  postType?: PostType;
  commentId?: string;
  mainTaskId?: string;
  visibleType: VisibleType;
  handleDelete?: (name: string) => void;
}

interface FileTypeGroup {
  [key: string]: string[];
  doc: string[];
  ppt: string[];
  excel: string[];
  others: string[];
}
const fileTypeGroup: FileTypeGroup = {
  doc: [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ],
  ppt: [
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  ],
  excel: [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ],
  others: ["application/pdf"],
  image: ["image/jpeg", "image/png", "image/gif", "image/jpg"]
};

export type fileType = "doc" | "ppt" | "excel" | "others" | "image";

const getFileType = (nativeType: string): fileType => {
  const fileType =
    Object.keys(fileTypeGroup).find(key => fileTypeGroup[key as fileType].includes(nativeType)) ??
    "others";
  return fileType as fileType;
};

const FileSection: React.FC<IFileSectionProps> = ({
  fileList,
  remoteFileList,
  postType,
  commentId,
  mainTaskId,
  visibleType,
  handleDelete
}) => {
  const getIndex = (index: number): number => index;
  return (fileList && fileList.length > 0) || (remoteFileList && remoteFileList.length > 0) ? (
    <div className="gap-row mb-6 grid grid-cols-1 gap-3 gap-y-6 lg:grid-cols-2 2xl:grid-cols-4">
      {fileList?.map((file, index) => (
        <FilePreview
          index={index}
          visibleType={visibleType}
          key={getIndex(index)}
          name={file.name}
          size={file.size}
          filetype={getFileType(mime.getType(file?.name) ?? "")}
          handleDelete={handleDelete}
        />
      ))}
      {remoteFileList?.map((file, index) => (
        <FilePreview
          index={index}
          visibleType={visibleType}
          key={getIndex(index)}
          mainTaskId={mainTaskId}
          postType={postType}
          commentId={commentId}
          name={file.name}
          originalName={file.originalName}
          handleDelete={handleDelete}
          filetype={getFileType(mime.getType(file?.name) ?? "")}
        />
      ))}
    </div>
  ) : (
    <></>
  );
};

export default FileSection;
