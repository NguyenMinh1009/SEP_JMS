import { useState, useEffect, useRef } from "react";
import { MdOutlineExpandCircleDown } from "react-icons/md";
import { CorrelationJobType } from "../../../enums/correlationJobType";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AlwayxInstance from "../../../api/AxiosInstance";
import CircularProgress from "@mui/material/CircularProgress";
import "react-quill/dist/quill.snow.css";
import "react-multi-carousel/lib/styles.css";
import { VisibleType } from "../../../enums/visibleType";
import { Role } from "../../../enums/role";
import useCurrentPerson from "../../../hooks/store/useCurrentPerson";
import useTitle from "../../../hooks/store/useCurrentTitle";
import BasicDetailsSection from "../../BasicDetailsSection";
import { getTaskDetails } from "../../../utils/getTaskDetails";
import { useInView } from "react-intersection-observer";
import TaskDetailsDescription from "../../TaskDetailsDescription";
import useSnakeBar from "../../../hooks/store/useSnakeBar";
import { PathString } from "../../../enums/MapRouteToBreadCrumb";
import { cn } from "../../../utils/className";
import { recursiveStructuredClone } from "../../../utils/recursiveStructuredClone";
import { FileResponse } from "../../../interface/fileResponse";
import CustomDialog from "../../common/CustomDialog";
import CommentSection from "../../../components/CommentSection";
import { IComments } from "../../../interface/comment";
import SubTasksSection from "./SubTasksSection";
import { RiAddCircleLine } from "react-icons/ri";
import { TaskString } from "../../../enums/taskEnums";

interface ISubTaskDetail {}

const InternalSubTasksDetail: React.FC<ISubTaskDetail> = () => {
  const [jobDetail, setJobDetail] = useState<any>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isOpenDialog, setOpenDialog] = useState<boolean>(false);
  const [isImagesLoading, setImagesLoading] = useState<boolean>(false);
  const [isCommentLoading, setCommentLoading] = useState<boolean>(false);
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [docFiles, setDocFiles] = useState<FileResponse[]>([]);
  const [comments, setComments] = useState<{
    items: IComments[];
    count: number;
  }>({ items: [], count: 0 });
  const [hasOlderComment, setHasOlderComment] = useState<boolean>(true);
  const [openDetailsEditPanel, setOpenDetailsEditPanel] = useState<boolean>(false);
  const getCommentTimes = useRef<number>(0);

  const [to, setTo] = useState<number | null>(null);
  const { ref: observerRef, inView: isObserverVisible } = useInView();
  const commentSectionTopRef = useRef<HTMLDivElement | null>(null);
  // custom hooks
  const snakeBar = useSnakeBar();
  const currentPerson = useCurrentPerson();
  const breadCrumbTitle = useTitle();
  const navigate = useNavigate();
  const { taskId, subTaskId } = useParams();

  const getComments = () => {
    setCommentLoading(true);
    getCommentTimes.current += 1;
    AlwayxInstance.post("comment/all", {
      pageIndex: 1,
      pageSize: 5,
      jobId: subTaskId,
      from: null,
      to: to,
      visibleType: VisibleType.Internal
    })
      .then(res => {
        const data = res.data;
        if (data.count > 0) {
          const listComments = data.items;
          setTo(listComments[listComments.length - 1].createdTime - 100);
          setComments(prev => {
            if (
              listComments.some((comment: IComments) =>
                prev.items.some(prevItem => prevItem.commentId === comment.commentId)
              )
            ) {
              return prev;
            }
            const temp = recursiveStructuredClone(prev);
            temp.count = data.count;
            temp.items = [...temp.items, ...listComments];
            return temp;
          });
        } else {
          if (getCommentTimes.current > 1) {
            setHasOlderComment(false);
            snakeBar.setSnakeBar("Không có comment cũ hơn!", "info", true);
          }
        }
      })
      .catch(err => {
        throw err;
      })
      .finally(() => {
        setCommentLoading(false);
      });
  };

  const handleHideComment = (id: string) => {
    const commentsClone = recursiveStructuredClone(comments);
    const currentCommentIndex = commentsClone.items.findIndex(comment => comment.commentId === id);
    if (currentCommentIndex > -1) {
      commentsClone.items.splice(currentCommentIndex, 1);
      commentsClone.count -= 1;
    }
    setComments(commentsClone);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleEdit = () => {
    navigate(
      `/${PathString.NOI_BO}/${PathString.VIEC_DU_AN}/${taskId}/${subTaskId}/${PathString.CHINH_SUA}`
    );
  };

  const getLatestComments = () => {
    setCommentLoading(true);
    const firstCommentCreatedTime = comments?.items?.[0]?.createdTime;
    AlwayxInstance.post("comment/all", {
      pageIndex: 1,
      pageSize: 1,
      jobId: subTaskId,
      from: firstCommentCreatedTime ? firstCommentCreatedTime + 100 : null,
      to: null,
      correlationJobType: CorrelationJobType.Job,
      visibleType: VisibleType.Internal
    })
      .then(res => {
        const data = res.data;
        if (data.count > 0) {
          const listComments = data.items;
          setComments(prev => {
            if (
              listComments.some((comment: IComments) =>
                prev.items.some(prevItem => prevItem.commentId === comment.commentId)
              )
            ) {
              return prev;
            }
            const temp = recursiveStructuredClone(prev);
            temp.count = data.count;
            temp.items = [...listComments, ...temp.items];
            return temp;
          });
          commentSectionTopRef?.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center"
          });
        }
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        setCommentLoading(false);
      });
  };

  {
    useEffect(() => {
      getTaskDetails(
        setLoading,
        setImagesLoading,
        setJobDetail,
        null,
        setDocFiles,
        setImgFiles,
        setOpenDialog,
        `internal/job/${subTaskId}`,
        `file/job/${subTaskId}`
      )
        .then()
        .catch(err => err);
    }, [taskId]);
  }

  useEffect(() => {
    if (isObserverVisible && hasOlderComment) {
      getComments();
    }
  }, [isObserverVisible]);

  return (
    <>
      <CustomDialog
        openDialog={isOpenDialog}
        handleClose={handleCloseDialog}
        title="Vui lòng thêm ảnh preview!"
        description="Cần thêm ảnh preview cho công việc đã hoàn thành"
        primaryBtnText="Chuyển tới chỉnh sửa"
        secondaryBtnText="Ở lại trang"
        primaryBtnCallback={handleEdit}
        secondaryBtnCallback={handleCloseDialog}
      />
      <div className="flex items-center justify-between">
        <p className="text-primary mb-6 text-base">Chi tiết công việc</p>
        {currentPerson.roleType !== Role.CUSTOMER && !isLoading && (
          <div
            onClick={() =>
              navigate(`/${PathString.CONG_KHAI}/${PathString.VIEC_DU_AN}/${taskId}/${subTaskId}`)
            }
            className="mr-2 flex cursor-pointer items-center gap-1 text-[#0655a7] hover:opacity-75 xl:mr-0"
          >
            <MdOutlineExpandCircleDown size={16} color="#0655a7" className="-rotate-90" />
            <p>
              <i className="text-[13px] font-[500]">Chuyển tới chờ khách duyệt</i>
            </p>
          </div>
        )}
      </div>
      <div className="relative -mx-2 -mt-2 grid h-max grid-cols-12 gap-6 px-2 ">
        {isLoading ? (
          <div className="common-border col-span-15 h-[calc(100vh-70px)]">
            <CircularProgress size={30} />
          </div>
        ) : (
          <>
            <div
              onClick={() => setOpenDetailsEditPanel(!openDetailsEditPanel)}
              className="absolute -top-14 right-3 flex cursor-pointer items-center gap-1 text-[#0655a7] hover:opacity-75 xl:hidden"
            >
              <MdOutlineExpandCircleDown
                size={16}
                color="#0655a7"
                className={openDetailsEditPanel ? "rotate-90" : "-rotate-90"}
              />
              <p>
                <i className="text-[13px] font-[500]">{TaskString.CHI_TIET}</i>
              </p>
            </div>
            <div
              className={cn(
                "col-span-12 -ml-2 max-h-[calc(100vh-140px)] overflow-y-auto scroll-smooth px-2 pt-2 transition-all scrollbar-hide xl:col-span-7",
                openDetailsEditPanel ? "opacity-0 xl:opacity-100" : "opacity-100"
              )}
            >
              <TaskDetailsDescription
                isImagesLoading={isImagesLoading}
                taskDetail={jobDetail}
                docFiles={docFiles}
                imgFiles={imgFiles}
              />

              {/* Comment section */}
              <div className="mb-6 mt-10 flex items-center">
                <p className="text-primary mr-4 w-fit pr-4 text-base leading-5">
                  {TaskString.BINH_LUAN_CONG_VIEC}
                </p>
                {/* <p className="text-primary mr-4 w-fit pr-4 text-base font-[400] leading-5">
                  Lịch sử hoạt động
                </p> */}
              </div>
              <div ref={commentSectionTopRef}></div>
              <CommentSection
                getComments={getLatestComments}
                // correlationJobType={CorrelationJobType.Job}
                visibleType={VisibleType.Internal}
                setComments={setComments}
                comments={comments?.items}
                handleHideComment={handleHideComment}
              />
              <div className="mt-5 flex h-16 items-center justify-center gap-2">
                {isCommentLoading && (
                  <>
                    <CircularProgress size={20} />
                    <p className="text-base italic">{TaskString.Dang_Tai_Them}</p>
                  </>
                )}
              </div>
              <div ref={observerRef} className="h-2 w-2 pb-5"></div>
            </div>
            <div
              className={cn(
                "absolute right-2 top-0 col-span-12 mt-2 flex h-fit flex-col px-6 py-5 shadow-custom transition-all xl:static xl:col-span-5",
                openDetailsEditPanel
                  ? "left-2 opacity-100"
                  : "pointer-events-none left-full opacity-0 xl:pointer-events-auto xl:opacity-100"
              )}
            >
              <BasicDetailsSection
                setOpenDialog={setOpenDialog}
                taskDetail={jobDetail}
                visibleType={VisibleType.Internal}
                correlationJobType={CorrelationJobType.Job}
                handleClickEdit={handleEdit}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default InternalSubTasksDetail;
