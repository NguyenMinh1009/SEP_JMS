import React from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import { formatDateTime, ticksToDate } from "../../utils/Datetime";
import { useNavigate } from "react-router-dom";
import { PathString } from "../../enums/MapRouteToBreadCrumb";
import { IoCreateOutline } from "react-icons/io5";
import { Role } from "../../enums/Role";
import useCurrentPerson from "../../hooks/store/useCurrentPerson";
import CustomDialog from "../common/CustomDialog";
import APIClientInstance from "../../api/AxiosInstance";
import useSnakeBar from "../../hooks/store/useSnakeBar";
import { GoDotFill } from "react-icons/go";
import { RiArchiveDrawerFill } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import { AccountStatusType } from "../../enums/accountStatusType";
import { accountStatusOptions, genderOptions, roleOptions } from "../../constants";
import { recursiveStructuredClone } from "../../utils/recursiveStructuredClone";
import { JobStatusType } from "../../enums/jobStatusType";
import { CorrelationJobType } from "../../enums/correlationJobType";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography
} from "@mui/material";
import CustomButton from "../common/CustomButton";
import { cn } from "../../utils/className";
import useTitle from "../../hooks/store/useCurrentTitle";

type IRowProps = {
  row: any;
  index: number;
  pageSize: number;
  page: number;
  setNotifications: (users: any) => void;
};

const NotificationTableRow: React.FC<IRowProps> = ({
  row,
  index,
  pageSize,
  page,
  setNotifications
}) => {
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const [openDetails, setOpenDetailsDialog] = React.useState(false);
  const [tempUnRead, setTempUnRead] = React.useState(true);

  const labelId = `enhanced-table-checkbox-${index}`;

  const navigate = useNavigate();
  const snakeBar = useSnakeBar();
  const currentPerson = useCurrentPerson();
  const titleBreadCrumb = useTitle();

  const handleClose = () => {
    setOpenConfirmDialog(false);
  };

  const navigateToJob = () => {
    // get job status then navigate from UI
    var bId = row.entityIdentifier.split("/");
    var isProject = bId.length > 1;
    var pathDef = isProject ? PathString.VIEC_DU_AN : PathString.VIEC_HANG_NGAY;
    APIClientInstance.get(`/job/${bId[bId.length - 1]}`).then(res => {
      const jobStatus: JobStatusType = res.data.jobStatus;
      const jobCorr: CorrelationJobType = res.data.correlationType;

      if (row.entityName.includes("Bình luận /")) {
        if (row.data.includes("[COMMENT_TYPE=Internal") || row.data.includes("[TYPE=Internal")) {
          navigate(`/${PathString.NOI_BO}/${pathDef}/${row.entityIdentifier}`);
          return;
        }
      }
      // for job
      if (jobCorr === CorrelationJobType.Job) {
        titleBreadCrumb.setContent(row.title.split("$[PRJ]$")[0]);

        if (jobStatus == JobStatusType.Completed) {
          navigate(`/${PathString.VIEC_DA_XONG}/${pathDef}/${row.entityIdentifier}`);
          return;
        }

        if (jobStatus == JobStatusType.Pending) {
          navigate(`/${PathString.NOI_BO}/${pathDef}/${row.entityIdentifier}`);
          return;
        }

        if (jobStatus == JobStatusType.CustomerReview || jobStatus == JobStatusType.Doing) {
          navigate(`/${PathString.CONG_KHAI}/${pathDef}/${row.entityIdentifier}`);
          return;
        }

        navigate(`/${PathString.CONG_KHAI}/${pathDef}/${row.entityIdentifier}`);
      }
      // for project
      if (jobCorr === CorrelationJobType.Project) {
        if (jobStatus == JobStatusType.Completed) {
          navigate(`/${PathString.VIEC_DA_XONG}/${PathString.VIEC_DU_AN}/${row.entityIdentifier}`);
          return;
        }

        if (jobStatus == JobStatusType.Pending) {
          navigate(`/${PathString.NOI_BO}/${PathString.VIEC_DU_AN}/${row.entityIdentifier}`);
          return;
        }

        if (jobStatus == JobStatusType.CustomerReview || jobStatus == JobStatusType.Doing) {
          navigate(`/${PathString.CONG_KHAI}/${PathString.VIEC_DU_AN}/${row.entityIdentifier}`);
          return;
        }

        navigate(`/${PathString.CONG_KHAI}/${PathString.VIEC_DU_AN}/${row.entityIdentifier}`);
      }
    });
  };

  const handleClickNoti = () => {
    setOpenDetailsDialog(true);
    setTempUnRead(false);
  };

  const handleCloseNoti = () => {
    setOpenDetailsDialog(false);
    // mark as read
    APIClientInstance.post(`/notification/read/${row.notificationId}`)
      .then(() => {
        // setNotifications((prev: any) => {
        //   let clone = recursiveStructuredClone(prev);
        //   const index = clone.findIndex((user: any) => user.notificationId === row.notificationId);
        //   if (index > -1) {
        //     clone[index].readAt = 1;
        //   }
        //   return clone;
        // });
      })
      .catch(err => {
        console.log(err);
        snakeBar.setSnakeBar("Có lỗi xảy ra", "error", true);
      });
  };

  const handleArchiveNoti = () => {
    APIClientInstance.post(
      row.archivedAt == null || row.archivedAt == 0
        ? `/notification/archive/${row.notificationId}`
        : `/notification/unarchive/${row.notificationId}`
    )
      .then(() => {
        snakeBar.setSnakeBar(
          row.archivedAt == null || row.archivedAt == 0
            ? "Lưu thông báo thành công"
            : "Huỷ lưu thông báo thành công",
          "success",
          true
        );
        setNotifications((prev: any) => {
          let clone = recursiveStructuredClone(prev);
          const index = clone.findIndex((user: any) => user.notificationId === row.notificationId);
          if (index > -1) {
            clone[index].archivedAt = row.archivedAt === 0 || row.archivedAt === null ? 1 : 0;
          }
          return clone;
        });
      })
      .catch(err => {
        console.log(err);
        snakeBar.setSnakeBar("Có lỗi xảy ra", "error", true);
      });
  };

  const handleDeleteNoti = () => {
    APIClientInstance.delete(`/notification/${row.notificationId}`)
      .then(() => {
        snakeBar.setSnakeBar("Xoá thành công", "success", true);
        setNotifications((prev: any) => {
          let clone = recursiveStructuredClone(prev);
          clone = clone.filter((e: any) => e.notificationId !== row.notificationId);
          return clone;
        });
      })
      .catch(err => {
        console.log(err);
        snakeBar.setSnakeBar("Có lỗi xảy ra", "error", true);
      });
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (openDetails) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [openDetails]);

  if (!row) return <></>;

  let notiDetails = "";
  notiDetails += `<b>Công việc:</b> ${row.title.replace("$[PRJ]$", "/")}<br>`;
  notiDetails += `<b>Hành động</b>: ${row.entityName}<br>`;
  row.message.substr(0, 3) != "Bạn" &&
    (notiDetails += `<b>Người gửi:</b> ${row.message.substr(0, row.message.indexOf(")") + 1)}<br>`);
  notiDetails += `<b>Thời gian:</b> ${formatDateTime(ticksToDate(row.createdTime))}<br>`;
  notiDetails += `<br>`;
  notiDetails += `<b><span class="bg-stone-200 inline-block w-full rounded-sm text-center">Nội dung</span></b><br>`;
  notiDetails += row.data.replace(/\[COMMENT_TYPE\=(Internal|Public)\]/, "");

  const isUnRead = tempUnRead && !row.readAt;

  return (
    <>
      <Dialog
        open={openDetails}
        onClose={handleCloseNoti}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="sm"
      >
        <DialogTitle id="scroll-dialog-title">
          <Typography fontWeight={"bold"}>Thông báo</Typography>
        </DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
            className="text-[14px]"
            color={"rgb(63 63 70)"}
            dangerouslySetInnerHTML={{ __html: notiDetails }}
          ></DialogContentText>
        </DialogContent>
        <DialogActions className="px-5 pb-4">
          {/* <Button size="small" className="text-[13px] normal-case" onClick={handleClose} autoFocus>
          {cancelBtnText}
        </Button> */}
          <CustomButton
            autoFocus
            primary
            onClick={navigateToJob}
            disablePadding
            className={cn("px-4 py-1")}
          >
            <p className="text-secondary text-[13px] normal-case leading-6 text-white">
              Đến công việc
            </p>
          </CustomButton>
          <Button
            size="small"
            className={cn("text-[13px] normal-case text-red-400")}
            onClick={handleCloseNoti}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      <CustomDialog
        openDialog={openConfirmDialog}
        handleClose={handleClose}
        title="Xoá thông báo"
        description={`Bạn có muốn xoá thông báo này không?`}
        primaryBtnText="Quay trở lại"
        secondaryBtnText="Tiếp tục"
        primaryBtnCallback={handleClose}
        secondaryBtnCallback={handleDeleteNoti}
      />
      <TableRow hover role="checkbox" tabIndex={-1} key={JSON.stringify(row)}>
        <TableCell
          padding="none"
          className="cursor-pointer border-r-[1px] p-2 align-top text-[13px] font-[400]"
          align="left"
        >
          <div
            className="mx-auto flex gap-1"
            onClick={() => {
              handleClickNoti();
            }}
          >
            {isUnRead ? (
              <GoDotFill color="green" size={18} />
            ) : (
              <GoDotFill color="gray" size={18} />
            )}

            <span
              className={cn(
                isUnRead ? "bg-emerald-500	" : "bg-gray-300",
                "inline-block w-28 rounded-sm text-center"
              )}
            >
              {moment(ticksToDate(row.createdTime)).fromNow()}
            </span>

            {isUnRead ? (
              <b>
                {row.message +
                  " [" +
                  row.title.replace("$[PRJ]$", "/") +
                  "] " +
                  (row.entityName.indexOf("Comment") === -1 && row.message.indexOf("Bạn") === -1
                    ? ""
                    : "") ?? "..."}
              </b>
            ) : (
              row.message +
                " [" +
                row.title.replace("$[PRJ]$", "/") +
                "] " +
                (row.entityName.indexOf("Comment") === -1 && row.message.indexOf("Bạn") === -1
                  ? ""
                  : "") ?? "..."
            )}
          </div>
        </TableCell>

        {/* Actions */}
        <TableCell
          padding="none"
          className="h-full min-w-[100px] justify-center p-2 align-top text-[13px] font-[400] first-letter:items-center"
          align="center"
        >
          <div className="flex h-full w-full items-center justify-center">
            <div className="mx-auto flex gap-1">
              <>
                {/* Archive notification  */}
                <span
                  onClick={handleArchiveNoti}
                  className={`group relative cursor-pointer border-r-[1px] border-[#999] px-1 pr-2 hover:scale-105`}
                >
                  {row.archivedAt === 0 || row.archivedAt === null ? (
                    <RiArchiveDrawerFill size={18} />
                  ) : (
                    <RiArchiveDrawerFill size={18} color="red" />
                  )}

                  <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-[#777] transition-all group-hover:w-full"></span>
                </span>

                {/* Delete notification */}
                <span
                  onClick={() => setOpenConfirmDialog(true)}
                  className="group relative cursor-pointer border-[#999] px-1 hover:scale-105"
                >
                  <TiDelete size={18} color="#666" />
                  <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-[#777] transition-all group-hover:w-full"></span>
                </span>
              </>
            </div>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};

export default NotificationTableRow;
