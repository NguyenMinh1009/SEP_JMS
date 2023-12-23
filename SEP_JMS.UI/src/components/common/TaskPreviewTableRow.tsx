import React from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import { ticksToDate } from "../../utils/Datetime";
import { getStatusBgColor } from "../../utils/Status";
import { Priority, priorityOptions } from "../../enums/priority";
import { internalStatusOptions, statusOptions } from "./StatusSection";
import { jobOptions } from "../../enums/jobType";
import { CorrelationJobType } from "../../enums/correlationJobType";
import { VisibleType } from "../../enums/visibleType";
import { useNavigate } from "react-router-dom";
import { convertVND } from "../../utils/VNDConvert";
import { getTextColorFromPriority } from "../../utils/Priority";
import { PathString } from "../../enums/MapRouteToBreadCrumb";
import { IoCreateOutline, IoCreateSharp } from "react-icons/io5";
import { HiOutlineEye } from "react-icons/hi";
import { BiTrashAlt } from "react-icons/bi";
import { Role } from "../../enums/Role";
import useCurrentPerson from "../../hooks/store/useCurrentPerson";
import { JobStatusType } from "../../enums/jobStatusType";
import CustomDialog from "./CustomDialog";
import AlwayxInstance from "../../api/AxiosInstance";
import useSnakeBar from "../../hooks/store/useSnakeBar";
import { correlationJobOptions } from "../../constants";
import { TaskString } from "../../enums/taskEnums";
import { PaymentSuccess, PaymentSuccessOptions } from "../../enums/paymentSuccess";
import { TbTrash, TbTrashFilled, TbTrashOff } from "react-icons/tb";
type IRowProps = {
  row: any;
  index: number;
  pageSize: number;
  page: number;
  correlationJobType: CorrelationJobType;
  visibleType: VisibleType;
  removeTaskPreview: (id: string) => void;
  finishOnly?: boolean;
};

const TaskPreviewTableRow: React.FC<IRowProps> = ({
  row,
  index,
  pageSize,
  page,
  correlationJobType,
  visibleType,
  removeTaskPreview,
  finishOnly
}) => {
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);

  const snakeBar = useSnakeBar();

  const labelId = `enhanced-table-checkbox-${index}`;

  const navigate = useNavigate();

  const currentPerson = useCurrentPerson();

  const { jobStatus, internalJobStatus } = row;

  const taskStatus = jobStatus ?? internalJobStatus;

  const getStatusOptions: { key: number; text: string }[] =
    visibleType === VisibleType.Public ? statusOptions : internalStatusOptions;

  const taskId: string = row.jobId ?? row.projectId ?? "";

  const getLinkForViewJob = (taskId: string): string => {
    switch (correlationJobType) {
      case CorrelationJobType.Job:
        if (finishOnly) return `/${PathString.VIEC_DA_XONG}/${PathString.VIEC_HANG_NGAY}/${taskId}`;
        if (visibleType === VisibleType.Public)
          return `/${PathString.CONG_KHAI}/${PathString.VIEC_HANG_NGAY}/${taskId}`;
        return `/${PathString.NOI_BO}/${PathString.VIEC_HANG_NGAY}/${taskId}`;
      case CorrelationJobType.Project:
        if (finishOnly) return `/${PathString.VIEC_DA_XONG}/${PathString.VIEC_DU_AN}/${taskId}`;
        if (visibleType === VisibleType.Public)
          return `/${PathString.CONG_KHAI}/${PathString.VIEC_DU_AN}/${taskId}`;
        return `/${PathString.NOI_BO}/${PathString.VIEC_DU_AN}/${taskId}`;
      default:
        return "";
    }
  };

  const isDisableWhenComplete = (): boolean => {
    if (currentPerson.roleType !== Role.ADMIN && taskStatus === JobStatusType.Completed)
      return true;
    if (row.finalJobType !== null) return true;
    if (
      currentPerson.roleType === Role.DESIGNER &&
      correlationJobType === CorrelationJobType.Project
    )
      return true;
    return false;
  };

  const getLinkForEditJob = (taskId: string) => {
    return getLinkForViewJob(taskId) + `/${PathString.CHINH_SUA}`;
  };

  const handleClose = () => {
    setOpenConfirmDialog(false);
  };

  const handleClickDeleteTask = () => setOpenConfirmDialog(true);

  const handleDeleteTask = () => {
    const deleteUrl = "job/" + taskId;
    AlwayxInstance.delete(deleteUrl)
      .then(() => {
        removeTaskPreview(taskId);
        snakeBar.setSnakeBar("Xoá công việc thành công!", "success", true);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const renderPriceCellBasedOnJobType = () => {
    if (correlationJobType === CorrelationJobType.Job) {
      return (
        <TableCell
          padding="none"
          className="min-w-[50px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
          align="center"
        >
          {row.quantity}
        </TableCell>
      );
    }
    // else {
    //   if (!currentPerson.hiddenPrice) {
    //     return (
    //       <TableCell
    //         padding="none"
    //         className="min-w-[60px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
    //         align="center"
    //       >
    //         {convertVND(row.price)}
    //       </TableCell>
    //     );
    //   }
    //   return <></>;
    // }
  };

  const renderJobType = () => {
    if (finishOnly) {
      if (row.paymentSuccess === PaymentSuccess.PAID && row.finalJobType !== null) {
        return (
          <>
            <TableCell
              padding="none"
              className="min-w-[96px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
              align="center"
            >
              {row.finalJobType ?? TaskString.TRONG}
            </TableCell>
          </>
        );
      }
    }
    return (
      <>
        <TableCell
          padding="none"
          className="min-w-[96px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
          align="center"
        >
          {row.jobType?.typeName ?? TaskString.TRONG}
        </TableCell>
      </>
    );
  };
  return (
    <>
      <CustomDialog
        openDialog={openConfirmDialog}
        handleClose={handleClose}
        title="Bạn có muốn xoá công việc này?"
        description="Một khi xoá, dữ liệu sẽ không thể khôi phục!"
        primaryBtnText="Quay trở lại"
        secondaryBtnText="Đồng ý xoá"
        primaryBtnCallback={handleClose}
        secondaryBtnCallback={handleDeleteTask}
      />
      <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
        <TableCell
          padding="none"
          className="min-w-[50px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
          align="center"
          component="th"
          id={labelId}
          scope="row"
        >
          {index + 1 + pageSize * (page - 1)}
        </TableCell>
        {/* {correlationJobType === CorrelationJobType.Job && (
          <TableCell
            padding="none"
            className="min-w-[80px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
            align="center"
          >
            {correlationJobOptions.find(item => item.key === row.correlationType)?.text}
          </TableCell>
        )} */}
        <TableCell
          padding="none"
          className="min-w-[80px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
          align="center"
        >
          {row.company?.companyName ?? TaskString.TRONG}
        </TableCell>
        <TableCell
          padding="none"
          className="border-r-[1px] p-2 align-top text-[13px] font-[400]"
          align="center"
        >
          {row.customer.fullname}
        </TableCell>
        <TableCell
          padding="none"
          className="max-w-[300px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
          align="center"
        >
          <p className="line-clamp-2 text-[13px] leading-5">{row.title}</p>
        </TableCell>
        <TableCell
          padding="none"
          className="border-r-[1px] p-2 align-top text-[13px] font-[400]"
          align="center"
        >
          {row.account.fullname}
        </TableCell>
        {correlationJobType === CorrelationJobType.Job && (
          <TableCell
            padding="none"
            className="border-r-[1px] p-2 align-top text-[13px] font-[400]"
            align="center"
          >
            {row.designer?.fullname ?? TaskString.TRONG}
          </TableCell>
        )}

        {renderJobType()}

        {renderPriceCellBasedOnJobType()}
        <TableCell
          padding="none"
          className="min-w-[100px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
          align="center"
        >
          {moment(ticksToDate(row.createdTime)).format("DD-MM-YYYY - h:mm")}
        </TableCell>
        <TableCell
          padding="none"
          className="min-w-[100px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
          align="center"
        >
          {moment(ticksToDate(row.deadline)).format("DD-MM-YYYY - h:mm")}
        </TableCell>
        <TableCell
          padding="none"
          className="min-w-[80px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
          align="center"
        >
          <div className={`font-[400] ${getTextColorFromPriority(row.priority)}`}>
            {priorityOptions.find(option => option.key === row.priority)?.text}
          </div>
        </TableCell>
        {finishOnly && (
          <TableCell
            padding="none"
            className="min-w-[80px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
            align="center"
          >
            <div
              className={`font-[400] ${
                row.paymentSuccess ? "font-semibold text-blue-800" : "font-semibold text-yellow-800"
              }`}
            >
              {PaymentSuccessOptions.find(payment => payment.key === row.paymentSuccess)?.text}
            </div>
          </TableCell>
        )}
        {!finishOnly ? (
          <TableCell
            padding="none"
            className="border-r-[1px] p-2 text-[13px] text-white"
            align="center"
          >
            <span
              className={`${getStatusBgColor(
                taskStatus,
                visibleType
              )} inline-block w-28 rounded-sm py-2 text-center font-[400]`}
            >
              {getStatusOptions.find(option => option.key === taskStatus)?.text}
            </span>
          </TableCell>
        ) : null}

        <TableCell
          padding="none"
          className="h-full min-w-[100px] justify-center p-2 align-top text-[13px] font-[400] first-letter:items-center"
          align="center"
        >
          <div className="flex h-full w-full items-center justify-center">
            <div className="mx-auto flex gap-1">
              <span
                onClick={() => {
                  navigate(getLinkForViewJob(taskId));
                }}
                className={`group relative cursor-pointer ${
                  isDisableWhenComplete() ? "" : "border-r-[1px]"
                } border-[#999] px-1 pr-2 hover:scale-105`}
              >
                {/* Chi tiết */}
                <HiOutlineEye size={18} color="#666" />
              </span>
              {!isDisableWhenComplete() && (
                <>
                  <button
                    disabled={row.paymentSuccess}
                    onClick={() => {
                      navigate(getLinkForEditJob(taskId));
                    }}
                    className={`group relative cursor-pointer ${
                      currentPerson.roleType === Role.CUSTOMER ||
                      (currentPerson.roleType === Role.DESIGNER &&
                        correlationJobType === CorrelationJobType.Job)
                        ? ""
                        : "border-r-[1px]"
                    } border-[#999] px-1 pr-2 hover:scale-105 ${row.paymentSuccess ? "text-pink-800" : ""}`}
                  >
                    {row.paymentSuccess ? (<IoCreateSharp size={18}/>) : (<IoCreateOutline size={18} />)}
                    
                  </button>
                  {currentPerson.roleType !== Role.CUSTOMER &&
                    currentPerson.roleType !== Role.DESIGNER && (
                      <button
                        disabled={row.paymentSuccess}
                        onClick={handleClickDeleteTask}
                        className={`group relative cursor-pointer border-[#999] px-1 hover:scale-105 ${row.paymentSuccess ? "text-pink-800" : ""}`}
                      >
                        {row.paymentSuccess ? (<TbTrashFilled size={18}/>) : (<TbTrash size={18} />)}
                        
                      </button>
                    )}
                </>
              )}
            </div>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};

export default TaskPreviewTableRow;
