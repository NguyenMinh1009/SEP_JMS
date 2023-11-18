import React from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import { ticksToDate } from "../../utils/Datetime";
import { useNavigate } from "react-router-dom";
import { PathString } from "../../enums/MapRouteToBreadCrumb";
import { IoCreateOutline } from "react-icons/io5";
import { Role } from "../../enums/role";
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
type IRowProps = {
  row: any;
  index: number;
  pageSize: number;
  page: number;
  setNotifications: (users: any) => void;
};

const NotificationTableRow: React.FC<IRowProps> = ({ row, index, pageSize, page, setNotifications }) => {
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);

  const labelId = `enhanced-table-checkbox-${index}`;

  const navigate = useNavigate();
  const snakeBar = useSnakeBar();
  const currentPerson = useCurrentPerson();

  const handleClose = () => {
    setOpenConfirmDialog(false);
  };

  const handleClickNoti = () => {
        // get job status then navigate from UI
        APIClientInstance.get(
          `/job/${row.entityIdentifier}`
        ).then(res => {
          const jobStatus: JobStatusType = res.data.jobStatus;
          const jobCorr: CorrelationJobType = res.data.correlationType;
          // for job
          if (jobCorr === CorrelationJobType.Job) {
            if (jobStatus == JobStatusType.Completed) navigate(
              `/${PathString.VIEC_DA_XONG}/${PathString.VIEC_HANG_NGAY}/${row.entityIdentifier}`
            );

            if (jobStatus == JobStatusType.Pending) navigate(
              `/${PathString.NOI_BO}/${PathString.VIEC_HANG_NGAY}/${row.entityIdentifier}`
            );

            if (jobStatus == JobStatusType.CustomerReview || jobStatus == JobStatusType.Doing) navigate(
              `/${PathString.CONG_KHAI}/${PathString.VIEC_HANG_NGAY}/${row.entityIdentifier}`
            );
          }
          // for project
          if (jobCorr === CorrelationJobType.Project) {
            if (jobStatus == JobStatusType.Completed) navigate(
              `/${PathString.VIEC_DA_XONG}/${PathString.VIEC_DU_AN}/${row.entityIdentifier}`
            );

            if (jobStatus == JobStatusType.Pending) navigate(
              `/${PathString.NOI_BO}/${PathString.VIEC_DU_AN}/${row.entityIdentifier}`
            );

            if (jobStatus == JobStatusType.CustomerReview || jobStatus == JobStatusType.Doing) navigate(
              `/${PathString.CONG_KHAI}/${PathString.VIEC_DU_AN}/${row.entityIdentifier}`
            );
          }
          
        });
        // mark as read
        APIClientInstance.post(
          `/notification/read/${row.notificationId}`
        )
        .then(() => {
          setNotifications((prev: any) => {
            let clone = recursiveStructuredClone(prev);
            const index = clone.findIndex((user: any) => user.notificationId === row.notificationId);
              if (index > -1) {
                clone[index].readAt =
                  row.readAt === 0 || row.readAt === null
                    ? 1
                    : 0;
              }
            return clone;
          });
          
        })
        .catch(err => {
          console.log(err);
          snakeBar.setSnakeBar("Có lỗi xảy ra", "error", true);
        });
        
  };

  const handleArchiveNoti = () => {
    APIClientInstance.post(
      (row.archivedAt == null || row.archivedAt == 0) ?
      `/notification/archive/${row.notificationId}` : `/notification/unarchive/${row.notificationId}`
    )
    .then(() => {
      snakeBar.setSnakeBar((row.archivedAt == null || row.archivedAt == 0) ? "Lưu thông báo thành công" : "Huỷ lưu thông báo thành công", "success", true);
      setNotifications((prev: any) => {
        let clone = recursiveStructuredClone(prev);
        const index = clone.findIndex((user: any) => user.notificationId === row.notificationId);
          if (index > -1) {
            clone[index].archivedAt =
              row.archivedAt === 0 || row.archivedAt === null
                ? 1
                : 0;
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
    APIClientInstance.delete(
      `/notification/${row.notificationId}`
    )
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

  if (!row) return <></>;

  return (
    <>
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
          <div className="mx-auto flex gap-1"
          onClick={()=>{handleClickNoti();}}
          >
            {row.readAt == null || row.readAt == 0 ? (
              <GoDotFill color="green" size={18} />
            ) : (
              <GoDotFill color="gray" size={18} />
            )}
            
            <div style={{ color: 'blue' }}>
            {"[" + moment(ticksToDate(row.createdTime)).fromNow() + "]"}
            </div>
          {row.message ?? "..."}
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
                  {row.archivedAt === 0 || row.archivedAt === null ?
                    (<RiArchiveDrawerFill size={18} />)
                    : (
                      <RiArchiveDrawerFill size={18} color="red" />
                    )
                  }
                  
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
