import React, { useState } from "react";
import BasicTaskInfo from "./common/BasicTaskInfo";
import { FiUser, FiUsers } from "react-icons/fi";
import { BiSupport } from "react-icons/bi";
import { AiOutlineClockCircle, AiOutlineEdit } from "react-icons/ai";
import { MdOutlineTypeSpecimen, MdSignalWifiStatusbarNull } from "react-icons/md";
import { HiOutlineCircleStack } from "react-icons/hi2";
import { getPriorityIcon, getTextColorFromPriority } from "../utils/Priority";
import { priorityOptions } from "../enums/priority";
import { IoCreateOutline } from "react-icons/io5";
import { BsWindowStack } from "react-icons/bs";
import CustomButton from "./common/CustomButton";
import moment from "moment";
import { ticksToDate } from "../utils/Datetime";
import { jobOptions } from "../enums/jobType";
import { internalStatusOptions, statusOptions } from "./common/StatusSection";
import { getStatusTextColor } from "../utils/Status";
import { CorrelationJobType } from "../enums/correlationJobType";
import { VisibleType } from "../enums/visibleType";
import { MenuItem, Select } from "@mui/material";
import { JobStatusType } from "../enums/jobStatusType";
import { InternalJobStatusType } from "../enums/internalJobStatusType";
import AlwayxInstance from "../api/AxiosInstance";
import { useParams } from "react-router-dom";
import useSnakeBar from "../hooks/store/useSnakeBar";
import { Role } from "../enums/role";
import useCurrentPerson from "../hooks/store/useCurrentPerson";
import { convertVND } from "../utils/VNDConvert";
import useSideBarPanel from "../hooks/store/useSideBarPanel";
import { cn } from "../utils/className";
import { correlationJobOptions } from "../constants";

interface IBasicDetailsSectionProps {
  taskDetail: any;
  correlationJobType: number;
  visibleType: VisibleType;
  handleClickEdit: () => void;
  setOpenDialog: (open: boolean) => void;
}

const BasicDetailsSection: React.FC<IBasicDetailsSectionProps> = ({
  taskDetail: jobDetail,
  correlationJobType,
  visibleType,
  handleClickEdit,
  setOpenDialog
}) => {
  const initStatus =
    visibleType === VisibleType.Public ? jobDetail?.jobStatus : jobDetail?.internalJobStatus;
  const [selectedStatus, setSelectedStatus] = useState<InternalJobStatusType>(initStatus);

  const { taskId } = useParams();
  const snakeBar = useSnakeBar();
  const sideBar = useSideBarPanel();
  const currentPerson = useCurrentPerson();

  const handleChangeInternalStatus = (status: InternalJobStatusType) => {
    AlwayxInstance.put(
      correlationJobType === CorrelationJobType.Job
        ? `internal/job/${taskId}/status`
        : `internal/project/${taskId}/status`,
      {
        internalJobStatus: status
      }
    )
      .then(() => {
        setSelectedStatus(status);
        if (status === InternalJobStatusType.Completed) {
          setOpenDialog(true);
        }
        snakeBar.setSnakeBar("Cập nhật trạng thái thành công", "success", true);
      })
      .catch(err => console.error(err));
  };

  const renderCorrelationJobType = () => {
    if (correlationJobType === CorrelationJobType.Job) {
      return (
        <BasicTaskInfo
          Icon={<HiOutlineCircleStack size={15} color="#555" />}
          title="Số lượng:"
          detail={jobDetail?.quantity}
        />
      );
    }
    return <></>;
  };
  return (
    <>
      <div className="grid grid-cols-2 gap-[2px] bg-third p-[2px]">
        <BasicTaskInfo
          Icon={<FiUsers size={15} color="#555" />}
          title="Khách hàng:"
          detail={jobDetail?.company?.companyName ?? "..."}
        />

        <BasicTaskInfo
          Icon={<FiUser size={15} color="#555" />}
          title="Người order:"
          detail={jobDetail?.customer?.fullname}
        />

        <BasicTaskInfo
          Icon={<BiSupport size={15} color="#555" />}
          title="Account:"
          detail={jobDetail?.account?.fullname}
        />

        <BasicTaskInfo
          Icon={<AiOutlineEdit size={15} color="#555" />}
          title="Designer:"
          detail={jobDetail?.designer?.fullname ?? "..."}
        />

        <BasicTaskInfo
          Icon={<AiOutlineClockCircle size={15} color="#555" />}
          title="Thời gian tạo:"
          detail={moment(ticksToDate(jobDetail?.createdTime)).format("DD-MM-YYYY - h:mm")}
        />

        <BasicTaskInfo
          Icon={<AiOutlineClockCircle size={15} color="#555" />}
          title="Deadline:"
          detail={moment(ticksToDate(jobDetail?.deadline)).format("DD-MM-YYYY - h:mm")}
          customText="text-red-600 font-semibold"
        />

        <BasicTaskInfo
          Icon={getPriorityIcon(jobDetail?.priority)}
          title="Ưu tiên:"
          detail={priorityOptions.find(option => option.key === jobDetail?.priority)?.text ?? "..."}
          customText={getTextColorFromPriority(jobDetail?.priority) + " font-semibold"}
        />
        {visibleType === VisibleType.Public && (
          <BasicTaskInfo
            Icon={<MdSignalWifiStatusbarNull size={15} color="#555" />}
            title="Trạng thái:"
            detail={statusOptions.find(option => option.key === initStatus)?.text ?? "..."}
            customText={getStatusTextColor(initStatus) + " font-semibold"}
          />
        )}

        {visibleType === VisibleType.Internal && (
          <div
            className={cn(
              "flex flex-col justify-start gap-0 bg-white",
              sideBar.isExpand ? "3xl:flex-row 3xl:gap-2" : "2xl:flex-row 2xl:gap-2"
            )}
          >
            <div
              className={cn(
                "flex min-w-[120px] items-center gap-2 bg-white p-3 pb-0 pr-0",
                sideBar.isExpand ? "3xl:pb-3" : "2xl:pb-3"
              )}
            >
              <div className="mb-1">
                <MdSignalWifiStatusbarNull size={15} color="#555" />
              </div>
              <label htmlFor="" className="text-primary">
                Trạng thái:
              </label>
            </div>
            <div
              className={cn(
                "flex h-full max-w-[150px] items-center px-2 4xl:max-w-[130px] 5xl:max-w-[170px]",
                sideBar.isExpand
                  ? "3xl:ml-2 3xl:max-w-[100px] 3xl:px-0"
                  : "2xl:ml-2 2xl:max-w-[100px] 2xl:px-0"
              )}
            >
              <Select
                disabled={
                  ((selectedStatus === InternalJobStatusType.Completed ||
                    initStatus === JobStatusType.Completed) &&
                    currentPerson.roleType !== Role.ADMIN) ||
                  currentPerson.roleType === Role.DESIGNER
                }
                fullWidth
                size="small"
                id="demo-simple-select"
                value={selectedStatus}
                onChange={e => handleChangeInternalStatus(Number(e.target.value))}
                sx={{
                  maxHeight: "26px",
                  "& .MuiInputBase-inputSizeSmall": {
                    fontSize: "13px !important"
                  }
                }}
              >
                {internalStatusOptions.map(({ key, text }) => (
                  <MenuItem key={key} value={key}>
                    {text}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
        )}

        <BasicTaskInfo
          Icon={<MdOutlineTypeSpecimen size={15} color="#555" />}
          title="Loại thiết kế:"
          detail={jobDetail?.jobType.typeName ?? "..."}
        />

        {renderCorrelationJobType()}

        {/* <BasicTaskInfo
          Icon={<BsWindowStack size={15} color="#555" />}
          title="Loại công việc:"
          detail={
            correlationJobOptions.find(item => item.key === jobDetail?.correlationType)?.text ?? ""
          }
        /> */}
        {/* <BasicTaskInfo Icon={<></>} title="" detail="" /> */}
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="relative mt-5 flex min-h-[100px] items-center gap-4">
          <CustomButton
            disabled={
              initStatus === JobStatusType.Completed && currentPerson.roleType !== Role.ADMIN
            }
            primary
            onClick={handleClickEdit}
          >
            <div className="flex items-center gap-2 px-2">
              <IoCreateOutline color="white" size={20} />
              <p className="text-secondary mt-[2px] text-sm normal-case leading-6 text-white">
                Chỉnh sửa công việc
              </p>
            </div>
          </CustomButton>
        </div>
      </div>
    </>
  );
};

export default BasicDetailsSection;
