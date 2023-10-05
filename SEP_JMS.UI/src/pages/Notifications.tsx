import "react-quill/dist/quill.snow.css";
import "react-multi-carousel/lib/styles.css";
import { IoAddCircleOutline } from "react-icons/io5";
import TaskPreview from "../components/TaskPreview";
import { CiExport } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { Role } from "../enums/role";
import useCurrentPerson from "../hooks/store/useCurrentPerson";
import { useState } from "react";
import { CircularProgress } from "@mui/material";
import moment from "moment";
import { PathString } from "../enums/MapRouteToBreadCrumb";
import JobFilterSection from "../components/common/JobFilterSection";
import useFilterInfo from "../hooks/store/useFilterInfo";
import AlwayxInstance from "../api/AxiosInstance";
import NotificationTable from "../components/notifications/NotificationTable";

interface IFinishedTasks {}
const UsersPage: React.FC<IFinishedTasks> = () => {
  const navigate = useNavigate();
  
  const [value, setValue] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");


  return (
    <>
      
      <div className="mb-10 flex items-center justify-between">
        <div className="gp-4 grid flex-1 grid-cols-3 xl:grid-cols-4">
          <div className="flex items-start gap-3">
            
           
          </div>
        </div>
        
      </div>
      <p className="text-primary mb-6 text-base">
       Thông báo
      </p>
      <div className="grid grid-cols-20 items-start gap-2">
        <div className="col-span-full overflow-hidden p-1 pb-20 ">
			<NotificationTable searchValue={searchValue}/>
		</div>
      </div>
    </>
  );
};

export default UsersPage;
