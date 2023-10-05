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
import { AiOutlineLock, AiOutlineUnlock } from "react-icons/ai";
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
        title="Thay dổi trạng thái tài khoản này?"
        description={`Bạn có muốn ${
          row.accountStatus === AccountStatusType.Active ? "tạm ngưng" : "kích hoạt"
        } tài khoản này`}
        primaryBtnText="Quay trở lại"
        secondaryBtnText="Tiếp tục"
        primaryBtnCallback={handleClose}
        secondaryBtnCallback={handleActiveUser}
      />
      <TableRow hover role="checkbox" tabIndex={-1} key={JSON.stringify(row)}>
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
        <TableCell
          padding="none"
          className="min-w-[80px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
          align="center"
        >
          {accountStatusOptions.find(item => item.key === row.accountStatus)?.text}
        </TableCell>
        <TableCell
          padding="none"
          className="min-w-[100px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
          align="center"
        >
          {row.fullname ?? "..."}
        </TableCell>
        <TableCell
          padding="none"
          className="min-w-[100px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
          align="center"
        >
          {row.username ?? "..."}
        </TableCell>
        {0 !== Role.CUSTOMER && (
          <TableCell
            padding="none"
            className="border-r-[1px] p-2 align-top text-[13px] font-[400]"
            align="center"
          >
            {row.address ?? "..."}
          </TableCell>
        )}
        {0 === Role.CUSTOMER && (
          <TableCell
            padding="none"
            className="min-w-[80px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
            align="center"
          >
            {row.company?.companyName ?? "..."}
          </TableCell>
        )}
        <TableCell
          padding="none"
          className="min-w-[100px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
          align="center"
        >
          {moment(ticksToDate(row.createdTime ?? 0)).format("DD-MM-YYYY - h:mm")}
        </TableCell>
        <TableCell
          padding="none"
          className="min-w-[100px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
          align="center"
        >
          {row.dob ? moment(ticksToDate(row.dob)).format("DD-MM-YYYY") : "---"}
        </TableCell>
        <TableCell
          padding="none"
          className="min-w-[100px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
          align="center"
        >
          {row.email ?? "..."}
        </TableCell>

        <TableCell
          padding="none"
          className="min-w-[70px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
          align="center"
        >
          {genderOptions.find(option => option.key === row.gender)?.text ?? "Không biết"}
        </TableCell>
        {0 === Role.CUSTOMER && (
          <TableCell
            padding="none"
            className="min-w-[70px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
            align="center"
          >
            {row.hiddenPrice ? "Không" : "Có"}
          </TableCell>
        )}

        {0 !== Role.CUSTOMER && (
          <>
            <TableCell
              padding="none"
              className="min-w-[60px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
              align="center"
            >
              {row.idCardNumber ?? "..."}
            </TableCell>
            <TableCell
              padding="none"
              className="min-w-[100px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
              align="center"
            >
              {row.onboardTime ? moment(ticksToDate(row.onboardTime)).format("DD-MM-YYYY") : "---"}
            </TableCell>
            <TableCell
              padding="none"
              className="min-w-[100px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
              align="center"
            >
              {row.offboardTime
                ? moment(ticksToDate(row.offboardTime)).format("DD-MM-YYYY")
                : "---"}
            </TableCell>
          </>
        )}
        <TableCell
          padding="none"
          className="min-w-[100px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
          align="center"
        >
          {row.phone ?? "..."}
        </TableCell>
        <TableCell
          padding="none"
          className="min-w-[100px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
          align="center"
        >
          {roleOptions.find(item => item.key === row.roleType)?.text}
        </TableCell>
        <TableCell
          padding="none"
          className="h-full min-w-[100px] justify-center p-2 align-top text-[13px] font-[400] first-letter:items-center"
          align="center"
        >
          <div className="flex h-full w-full items-center justify-center">
            <div className="mx-auto flex gap-1">
              <>
                <span
                  onClick={handleEditUser}
                  className={`group relative cursor-pointer border-r-[1px] border-[#999] px-1 pr-2 hover:scale-105`}
                >
                  <IoCreateOutline size={18} />
                  <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-[#777] transition-all group-hover:w-full"></span>
                </span>
                <span
                  onClick={() => setOpenConfirmDialog(true)}
                  className="group relative cursor-pointer border-[#999] px-1 hover:scale-105"
                >
                  {row.accountStatus === AccountStatusType.Active ? (
                    <AiOutlineLock size={18} color="#666" />
                  ) : (
                    <AiOutlineUnlock size={18} color="#666" />
                  )}
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
