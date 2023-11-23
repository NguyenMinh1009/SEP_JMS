import { useEffect, useState, useRef, useCallback } from "react";
import { IComments } from "../../interface/comment";
import { ticksToDate } from "../../utils/Datetime";
import moment from "moment";
import mime from "mime";
import AlwayxInstance from "../../api/AxiosInstance";
import { PostType } from "../../enums/postType";
import { useParams } from "react-router-dom";
import FileSection from "../FileSection";
import { CorrelationJobType } from "../../enums/correlationJobType";
import useCurrentPerson from "../../hooks/store/useCurrentPerson";
import { VisibleType } from "../../enums/visibleType";
import ImageSection from "./ImageSection";
import { BiComment } from "react-icons/bi";
import { MdHideSource } from "react-icons/md";
import { Role } from "../../enums/role";
import ReplyCommentSection from "../ReplyCommentSection";
import { useClickOutside } from "../../utils/useClickOutside";
import CustomDialog from "./CustomDialog";
import useSnakeBar from "../../hooks/store/useSnakeBar";
import { FileResponse } from "../../interface/fileResponse";
import { APIUrlHost } from "../../constants";

const ReplyComment = ({
  content,
  commentId,
  correlationJobId,
  correlationJobType,
  user,
  hasReply,
  replyCommentId,
  attachments,
  createdTime,
  getAllReply,
  visibleType,
  parentUser,
  parentContent,
  handleHideComment
}: Partial<IComments> & {
  getAllReply: () => void;
  visibleType: VisibleType;
  parentUser?: any;
  parentContent?: string;
  handleHideComment?: (id: string) => void;
}) => {
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [docFiles, setDocFiles] = useState<FileResponse[]>([]);
  const [overflowActive, setOverflowActive] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [isOpenReplySection, setOpenReplySection] = useState<boolean>(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);

  const wrapperRef = useRef<any>(null);
  const snakeBar = useSnakeBar();

  useClickOutside(
    wrapperRef,
    () => {
      if (isOpenReplySection && !openConfirmDialog) setOpenConfirmDialog(true);
    },
    ".reply-btn"
  );

  const { taskId, subTaskId } = useParams();
  const currentPerson = useCurrentPerson();
  const overflowingText = useRef<HTMLDivElement | null>(null);

  const getLinkForJobType = (): string => {
    if (visibleType === VisibleType.Public) return "file/job/";
    return "file/internal/job/";
  };

  const getAttachmentDetails = async () => {
    const attachmentFiles = attachments?.files;
    if (attachmentFiles && attachmentFiles.length > 0) {
      const docList = attachmentFiles.filter(
        file => !mime.getType(file.fileName)?.includes("image")
      );
      setDocFiles(docList);
      const imgList: FileResponse[] = [];
      attachmentFiles.forEach(file => {
        if (mime.getType(file.fileName)?.includes("image")) imgList.push(file);
      });
      for (const img of imgList) {
        const response = await AlwayxInstance.post(
          subTaskId === undefined
            ? `${getLinkForJobType() + taskId}`
            : `${getLinkForJobType() + subTaskId}`,
          {
            commentId: commentId,
            fileName: img.fileName,
            postsType: PostType.comment
          },
          { responseType: "blob" }
        );
        const newImg = new File([response.data], img.fileName, { type: response.data.type });
        setImgFiles(prev => [newImg, ...prev]);
      }
    }
  };

  const handleConfirmHideComment = () => {
    AlwayxInstance.post(`comment/${commentId}/hide`)
      .then(() => {
        handleHideComment?.(commentId as string);
        snakeBar.setSnakeBar("Ẩn comment thành công!", "success", true);
      })
      .catch(err => err);
  };

  const checkOverflow = (textContainer: HTMLSpanElement | null): boolean => {
    if (textContainer)
      return (
        textContainer.offsetHeight < textContainer.scrollHeight ||
        textContainer.offsetWidth < textContainer.scrollWidth
      );
    return false;
  };

  useEffect(() => {
    if (checkOverflow(overflowingText.current)) {
      setOverflowActive(true);
      return;
    }
    setOverflowActive(false);
  }, [overflowActive, showMore]);

  const handleClose = () => {
    setOpenConfirmDialog(false);
  };

  const handleCloseDeleteDialog = () => {
    setOpenConfirmDeleteDialog(false);
  };

  useEffect(() => {
    getAttachmentDetails();
  }, [taskId]);

  return (
    <div ref={wrapperRef}>
      <CustomDialog
        openDialog={openConfirmDialog}
        handleClose={handleClose}
        title="Cảnh báo - comment chưa hoàn thành!"
        description="Nội dung comment sẽ bị xóa, bạn có chắc không?"
        primaryBtnText="Tiếp tục comment"
        secondaryBtnText="Đồng ý hủy"
        primaryBtnCallback={handleClose}
        secondaryBtnCallback={() => setOpenReplySection(false)}
      />
      <CustomDialog
        openDialog={openConfirmDeleteDialog}
        handleClose={handleCloseDeleteDialog}
        title="Cảnh báo - bạn sẽ ẩn comment này!"
        description="Liên hệ người quản lí để khôi phục comment!"
        primaryBtnText="Quay lại"
        secondaryBtnText="Đồng ý ẩn"
        primaryBtnCallback={handleCloseDeleteDialog}
        secondaryBtnCallback={() => handleConfirmHideComment()}
      />
      <div className="comment flex flex-col gap-3 rounded-md px-5 pb-3 pt-4 shadow-custom">
        <div className="flex w-full">
          <div className="h-8 w-8 shrink-0 rounded-full bg-slate-500">
            <img
              src={APIUrlHost + "/" + currentPerson.avatarUrl + "?t=0"}
              className="h-full w-full rounded-full"
              alt=""
            />
          </div>
          <div className="-mt-1 flex-1 pl-4">
            <div className="break-word mb-1 grow-0 hyphens-auto rounded-md bg-white">
              <div className="flex justify-between gap-3">
                <div className="flex items-center">
                  <div className="text-primary border-r-2 pr-4">{user?.fullname}</div>
                  <div className="text-primary ml-3 flex items-center gap-1 text-xs font-[400]">
                    {moment(ticksToDate(createdTime ?? 0)).format("DD-MM-YYYY")}
                    <p className="text-secondary"> - </p>
                    {moment(ticksToDate(createdTime ?? 0)).format("h:mm:ss")}
                  </div>
                </div>
              </div>
              <div className="relative mb-2 mt-3 min-h-[40px] w-full bg-[#f0f0f0] px-6 py-4">
                <p className="text-primary text-accent">{parentUser?.fullname}</p>
                <div
                  ref={overflowingText}
                  className={`${!showMore ? "max-h-[72px]" : "max-h-none"} overflow-hidden`}
                >
                  <div
                    className="text-comment-container leading-9"
                    dangerouslySetInnerHTML={{
                      __html: parentContent ?? ""
                    }}
                  ></div>
                  {overflowActive && (
                    <div className="job-content-container-overlay pointer-events-none absolute inset-0"></div>
                  )}
                  <div className="absolute inset-0 border-l-4 border-accent">
                    {overflowActive && (
                      <p
                        onClick={() => setShowMore(true)}
                        className="text-primary absolute bottom-0 left-1/2 -translate-x-1/2 cursor-pointer text-accent hover:opacity-75"
                      >
                        Mở rộng
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div
                className="text-comment-container leading-9"
                dangerouslySetInnerHTML={{
                  __html:
                    `<p><span class="font-semibold italic text-accent mr-2">@${parentUser?.fullname}</span>` +
                    (content?.slice(3) ?? "")
                }}
              ></div>
              <div className="mt-3">
                <FileSection
                  visibleType={visibleType}
                  commentId={commentId}
                  postType={PostType.comment}
                  remoteFileList={docFiles.map(file => ({
                    name: file.fileName,
                    type: file.mimeType,
                    originalName: file.originalName
                  }))}
                />
              </div>
              <ImageSection imgFiles={imgFiles} />
            </div>
            <div className="mt-2 flex items-center justify-end gap-5">
              {/* <div className="-mr-2 flex items-center gap-1 rounded-full border-[1px] border-[#00000022] p-[1px] pr-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                  <AiOutlineLike size={14} className="mb-[1px]" />
                </div>
                <p className="h-[14px] text-sm font-[500] leading-[14px] text-accent">2</p>
              </div>
              <div className="flex cursor-pointer items-center gap-1 text-accent transition-all hover:opacity-70">
                <AiOutlineLike size={20} className="font-bold" />
                <p className="mt-1 text-sm font-bold">Thích</p>
              </div> */}
              <div
                onClick={() => {
                  setOpenReplySection(!isOpenReplySection);
                }}
                className="reply-btn flex cursor-pointer items-center gap-1 transition-all hover:opacity-70"
              >
                <BiComment size={12} color="#333" className="mt-[1px]" />
                <p className="text-xs font-[500]">Phản hồi</p>
              </div>
              {(currentPerson.userId === user?.userId || currentPerson.roleType === Role.ADMIN) && (
                <div
                  onClick={() => setOpenConfirmDeleteDialog(true)}
                  className="flex cursor-pointer items-center gap-1 transition-all hover:opacity-70"
                >
                  <MdHideSource size={12} color="#333" />
                  <p className="text-xs font-[500]">Ẩn</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ReplyCommentSection
        setOpenReplySection={setOpenReplySection}
        getComments={getAllReply}
        parentContent={content}
        expand={isOpenReplySection}
        visibleType={visibleType}
        correlationJobType={correlationJobType ?? CorrelationJobType.Job}
        replyCommentId={commentId ?? ""}
        parentUser={user}
      />
    </div>
  );
};

export default ReplyComment;
