import { MdSignalWifiStatusbarNull } from "react-icons/md";
import { JobStatusType } from "../../enums/jobStatusType";
import { InternalJobStatusType } from "../../enums/internalJobStatusType";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import useCurrentPerson from "../../hooks/store/useCurrentPerson";
import { Role } from "../../enums/Role";
import { VisibleType } from "../../enums/visibleType";
import useSnakeBar from "../../hooks/store/useSnakeBar";
import { getStatusBgColor } from "../../utils/Status";

interface IStatusSection {
  handleUpdate: (status: number) => Promise<any>;
  jobStatus: number;
  setCurrentStatus?: React.Dispatch<React.SetStateAction<JobStatusType>>;
  visibleType: VisibleType;
}

export const statusOptions = [
  {
    key: JobStatusType.NotDo,
    text: "Chưa làm"
  },
  {
    key: JobStatusType.Doing,
    text: "Đang làm"
  },
  {
    key: JobStatusType.CustomerReview,
    text: "Chờ khách duyệt"
  },
  {
    key: JobStatusType.Completed,
    text: "Đã xong"
  },
  {
    key: JobStatusType.Pending,
    text: "Pending"
  }
];

export const internalStatusOptions = [
  {
    key: InternalJobStatusType.NotDo,
    text: "Chưa làm"
  },
  {
    key: InternalJobStatusType.Doing,
    text: "Đang làm"
  },
  {
    key: InternalJobStatusType.InternalReview,
    text: "Chờ duyệt NB"
  },
  {
    key: InternalJobStatusType.Completed,
    text: "Đã xong"
  },
  {
    key: InternalJobStatusType.Pending,
    text: "Pending"
  },
  {
    key: InternalJobStatusType.CustomerReview,
    text: "Chờ khách duyệt"
  }
];
export const statusFilterOptions = [
  {
    key: JobStatusType.NotDo,
    text: "Chưa làm"
  },
  {
    key: JobStatusType.Doing,
    text: "Đang làm"
  },
  {
    key: JobStatusType.CustomerReview,
    text: "Chờ khách duyệt"
  },
  {
    key: JobStatusType.Pending,
    text: "Pending"
  }
];

export const internalStatusFilterOptions = [
  {
    key: InternalJobStatusType.NotDo,
    text: "Chưa làm"
  },
  {
    key: InternalJobStatusType.Doing,
    text: "Đang làm"
  },
  {
    key: InternalJobStatusType.InternalReview,
    text: "Chờ duyệt NB"
  },
  {
    key: InternalJobStatusType.Pending,
    text: "Pending"
  },
  {
    key: InternalJobStatusType.CustomerReview,
    text: "Chờ khách duyệt"
  }
];

const StatusSection: React.FC<IStatusSection> = ({
  handleUpdate,
  jobStatus,
  setCurrentStatus,
  visibleType
}) => {
  const [selectedStatus, setSelectedStatus] = useState<number>(jobStatus);
  const [isLoading, setLoading] = useState<boolean>(false);
  const currentPerson = useCurrentPerson();
  const snakeBar = useSnakeBar();

  const handleChangeStatus = (e: any) => {
    setLoading(true);
    const targetValue = Number(e.target.value);
    handleUpdate(targetValue)
      .then(() => {
        setSelectedStatus(targetValue);
        setCurrentStatus?.(targetValue);
        setLoading(false);
        snakeBar.setSnakeBar("Cập nhật thành công", "success", true);
      })
      .catch(_err => {
        snakeBar.setSnakeBar("Cập nhật thất bại", "error", true);
        setLoading(false);
      });
  };

  return (
    <div className="flex h-9 items-center gap-3 ">
      <MdSignalWifiStatusbarNull size={15} color="#555" />
      <p className="min-w-[70px]">Trạng thái</p>
      <select
        value={selectedStatus}
        onChange={e => handleChangeStatus(e)}
        className={`text-primary cursor-pointer rounded-md transition-all hover:opacity-80 ${getStatusBgColor(
          selectedStatus
        )} p-1 text-sm text-[#eee] outline-none`}
      >
        {(visibleType === VisibleType.Public ? statusOptions : internalStatusOptions).map(
          option => (
            <option
              disabled={
                currentPerson.roleType !== Role.ADMIN && selectedStatus === JobStatusType.Completed
              }
              key={option.key}
              className="bg-white text-[#333]"
              value={option.key}
            >
              {option.text}
            </option>
          )
        )}
      </select>
      {isLoading && <CircularProgress size={15} color="primary" />}
    </div>
  );
};

export default StatusSection;
