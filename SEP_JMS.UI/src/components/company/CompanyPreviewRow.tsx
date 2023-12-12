import React from "react";
import { CompanyResponseType } from "../../interface/company";
import { TableCell, TableRow } from "@mui/material";
import { IoCreateOutline } from "react-icons/io5";
import { BiTrashAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { PathString } from "../../enums/MapRouteToBreadCrumb";
import APIClientInstance from "../../api/AxiosInstance";
import useSnakeBar from "../../hooks/store/useSnakeBar";
import CustomDialog from "../common/CustomDialog";
import { CompanyStatusType } from "../../enums/companytStatusType";
import { AiOutlineLock, AiOutlineUnlock } from "react-icons/ai";

interface IRowProps {
  row: Partial<CompanyResponseType>;
  index: number;
  pageSize: number;
  page: number;
  setRefresh: (num: number) => void;
}

const CompanyPreviewRow: React.FC<IRowProps> = ({ row, index, pageSize, page, setRefresh }) => {
  const labelId = `enhanced-table-checkbox-${index}`;
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const navigate = useNavigate();
  const snakeBar = useSnakeBar();
  const handleClose = () => {
    setOpenConfirmDialog(false);
  };
  const handleClickDeleteTask = () => {
    APIClientInstance.delete(
      `admin/company/${row.company?.companyId}`
    )
      .then(() => {
        setRefresh(Date.now());
        snakeBar.setSnakeBar("Xoá công ty thành công", "success", true);
        
      })
      .catch(err => {
        snakeBar.setSnakeBar("Có lỗi xảy ra! [" + err.response.data + "]", "error", true);
      });
  }

  const handleActiveCompany = () => {
    APIClientInstance.get(
      row.company?.companyStatus === CompanyStatusType.Active
        ? `admin/company/${row.company?.companyId}/inactive`
        : `admin/company/${row.company?.companyId}/active`
    )
      .then(() => {
        snakeBar.setSnakeBar("Thay đổi thành công", "success", true);
        setRefresh(Date.now());
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
        title="Thay dổi trạng thái công ty này?"
        description={`Bạn có muốn ${
          row.company?.companyStatus === CompanyStatusType.Active ? "tạm ngưng" : "kích hoạt"
        } công ty này? (Bao gồm nhân viên)`}
        primaryBtnText="Quay trở lại"
        secondaryBtnText="Tiếp tục"
        primaryBtnCallback={handleClose}
        secondaryBtnCallback={handleActiveCompany}
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
          {row.company?.companyName}
        </TableCell>
        <TableCell
          padding="none"
          className="min-w-[80px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
          align="center"
        >
          {row.company?.companyAddress ?? "---"}
        </TableCell>
        <TableCell
          padding="none"
          className="min-w-[80px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
          align="center"
        >
          {row.company?.description ?? "---"}
        </TableCell>
        <TableCell
          padding="none"
          className="min-w-[80px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
          align="center"
        >
          {`${row.account?.fullname} (${row.account?.username})`}
        </TableCell>
        <TableCell
          padding="none"
          className="min-w-[80px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
          align="center"
        >
          {row.priceGroup?.name}
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
                  onClick={() => {
                    navigate(
                      `/${PathString.USERS}/${PathString.COMPANY}/${row.company?.companyId ?? ""}/${PathString.CHINH_SUA
                      }`
                    );
                  }}
                  className="group relative cursor-pointer border-[#999] px-1 hover:scale-105"
                >
                  <IoCreateOutline size={18} />
                  <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-[#777] transition-all group-hover:w-full"></span>
                </span>
                <span
                  onClick={() => setOpenConfirmDialog(true)}
                  className="group relative cursor-pointer border-[#999] px-1 hover:scale-105"
                >
                  {row.company?.companyStatus === CompanyStatusType.Active ? (
                    <AiOutlineUnlock size={18} color="#666" />
                  ) : (
                    <AiOutlineLock size={18} color="#f56342" />
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

export default CompanyPreviewRow;
