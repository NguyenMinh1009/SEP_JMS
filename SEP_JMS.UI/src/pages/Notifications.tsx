import "react-quill/dist/quill.snow.css";
import "react-multi-carousel/lib/styles.css";
import { IoAddCircleOutline } from "react-icons/io5";
import TaskPreview from "../components/TaskPreview";
import { CiExport } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { Role } from "../enums/role";
import { notificationStatusOptions } from "../constants";
import useCurrentPerson from "../hooks/store/useCurrentPerson";
import { useState } from "react";
import { CircularProgress } from "@mui/material";
import { MenuItem, Select, TextField } from "@mui/material";
import moment from "moment";
import { PathString } from "../enums/MapRouteToBreadCrumb";
import JobFilterSection from "../components/common/JobFilterSection";
import useFilterInfo from "../hooks/store/useFilterInfo";
import APIClientInstance from "../api/AxiosInstance";
import NotificationTable from "../components/notifications/NotificationTable";
import { NotificationStatus } from "../enums/NotificationStatus";
import { BsCheckAll } from "react-icons/bs";
import useSnakeBar from "../hooks/store/useSnakeBar";


interface IFinishedTasks {}
const UsersPage: React.FC<IFinishedTasks> = () => {
  const navigate = useNavigate();
  
  const [value, setValue] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<NotificationStatus>(NotificationStatus.ALL);

  const snakeBar = useSnakeBar();

  const handleMarkReadAllNoti = () => {
    APIClientInstance.post(
      `/notification/readAll`
    )
    .then(() => {
      snakeBar.setSnakeBar("Successfully", "success", true);
      setSelectedStatus(NotificationStatus.ALL);
    })
    .catch(err => {
      console.log(err);
      snakeBar.setSnakeBar("Có lỗi xảy ra", "error", true);
    });
    
  };

  return (
    <>
      
      <div className="mb-10 flex items-center justify-between">
        <div className="gp-4 grid flex-1 grid-cols-3 xl:grid-cols-4">
          <div className="flex items-start gap-3">
          <Select
              fullWidth
              size="small"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value as NotificationStatus)}
              sx={{
                maxWidth: "180px",
                "& .MuiInputBase-inputSizeSmall": {
                  fontSize: "13px !important"
                }
              }}
            >
              {notificationStatusOptions.map(({ key, text }) => (
                <MenuItem key={key} value={key}>
                  {text}
                </MenuItem>
              ))}
            </Select>
           
          </div>
        </div>
        <div
          onClick={() => {
            handleMarkReadAllNoti();
          }}
          className="flex cursor-pointer items-center gap-2 rounded-md bg-accent p-3 text-white hover:opacity-75"
        >
          <BsCheckAll size={20} className="text-white" />
          <span>Đánh dấu đã đọc tất cả</span>
        </div>
      </div>
      <p className="text-primary mb-6 text-base">
       Thông báo
      </p>
      <div className="grid grid-cols-20 items-start gap-2">
        <div className="col-span-full overflow-hidden p-1 pb-20 ">
			<NotificationTable status={selectedStatus as unknown as NotificationStatus} searchValue={searchValue}/>
		</div>
      </div>
    </>
  );
};

export default UsersPage;
