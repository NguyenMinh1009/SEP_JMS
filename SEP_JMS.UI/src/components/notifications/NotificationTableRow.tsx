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
import AlwayxInstance from "../../api/AxiosInstance";
import useSnakeBar from "../../hooks/store/useSnakeBar";
import { FaPhoenixFramework } from "react-icons/fa";
import { RiArchiveDrawerFill } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import { AccountStatusType } from "../../enums/accountStatusType";
import { accountStatusOptions, genderOptions, roleOptions } from "../../constants";
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

  const handleEditUser = () => {
    
  };

  const handleActiveUser = () => {
    
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
        secondaryBtnCallback={handleActiveUser}
      />
      <TableRow hover role="checkbox" tabIndex={-1} key={JSON.stringify(row)}>
        
        
        
        <TableCell
          padding="none"
          className="cursor-pointer border-r-[1px] p-2 align-top text-[13px] font-[400]"
          align="left"
        >
          <div className="mx-auto flex gap-1"
          onClick={()=>{alert("View")}}
          >
            <FaPhoenixFramework color="green" size={18} />
            <div style={{ color: 'blue' }}>
            {"[" + moment(ticksToDate(row.createdTime)).fromNow() + "]"}
            </div>
          {row.message ?? "..."}
          </div>
        </TableCell>

        
        
        
        
        
      </TableRow>
    </>
  );
};

export default NotificationTableRow;
