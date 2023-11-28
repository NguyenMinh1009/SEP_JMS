import React from "react";
import { TableCell, TableRow } from "@mui/material";
import { IoCreateOutline } from "react-icons/io5";
import { BiTrashAlt } from "react-icons/bi";
import { PriceGroup } from "../../../interface/price";
import { HiOutlineEye } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { PathString } from "../../../enums/MapRouteToBreadCrumb";
import useTitle from "../../../hooks/store/useCurrentTitle";
import { cn } from "../../../utils/className";
import CustomDialog from "../../common/CustomDialog";
import APIClientInstance from "../../../api/AxiosInstance";
import useSnakeBar from "../../../hooks/store/useSnakeBar";
import { AiFillEdit, AiFillSave } from "react-icons/ai";

interface IRowProps {
  row: any;
  index: number;
  removeRow: (id: string) => void;
}

const TypeOfJobRow: React.FC<IRowProps> = ({
  row,
  index,
  removeRow
}) => {
  const [isProcess, setIsProcess] = React.useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const [editable, setEditable] = React.useState(false);
  const [bindData, setBindData] = React.useState(row);
  const [oldData, setOldData] = React.useState(row.typeName);

  const navigate = useNavigate();
  const title = useTitle();
  const snakeBar = useSnakeBar();
  const labelId = `enhanced-table-checkbox-${index}`;

  const handleClose = () => {
    setOpenConfirmDialog(false);
  };

  const handleDeleteJobType = () => {
    APIClientInstance.delete(`jobtype/${row.typeId}`)
      .then(() => {
        
        snakeBar.setSnakeBar("Xoá thiết kế thành công!", "success", true);
        removeRow(row.typeId ?? 0);
      })
      .catch(err => {
        
        snakeBar.setSnakeBar("Có lỗi xảy ra khi xoá! [" + err.response.data + "]", "error", true);
        
      });
    
  };

  const handleEditTypeName = () => {
    setIsProcess(true);
    APIClientInstance.post(`jobtype/${row.typeId}`, null, { params: {
      name: bindData.typeName
    }})
      .then(() => {
        snakeBar.setSnakeBar("Lưu thiết kế thành công!", "success", true);
        setOldData(bindData.typeName);
        setEditable(false);
      })
      .catch(err => {
        snakeBar.setSnakeBar("Có lỗi xảy ra khi lưu! [" + err.response.data + "]", "error", true);
      }).finally(()=>{
        setIsProcess(false);
      });
    // removeRow(row.typeId ?? 0);
  };

  const handleChangeTypeName = (event: any) => {
    setBindData({typeId: row.typeId, typeName: event.target.value});
    console.log(bindData);
  };

  if (!row) return <></>;
  return (
    <>
      <CustomDialog
        openDialog={openConfirmDialog}
        handleClose={handleClose}
        title="Xoá thiết kế?"
        description={`Bạn có muốn xoá thiết kế [${row.typeName}] không?`}
        primaryBtnText="Quay trở lại"
        secondaryBtnText="Đồng ý xoá"
        primaryBtnCallback={handleClose}
        secondaryBtnCallback={handleDeleteJobType}
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
          {index + 1}
        </TableCell>
        
        <TableCell
          padding="none"
          className={cn("min-w-[80px] border-r-[1px] text-[13px] font-[400]", editable ? "p-1" : "p-2")}
          align="center"
        >
          {editable ? (
            <input disabled={isProcess} type="text" defaultValue={oldData} className="h-[26px] w-full border-[1px] px-2" onChange={handleChangeTypeName} />
          ) : (
            oldData
          )}
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
                    if (!editable) 
                      setEditable(!editable);
                    else {
                      handleEditTypeName();
                    }
                  }}
                  className="group relative cursor-pointer border-r-[1px] border-[#999] px-1 pr-2 hover:scale-105"
                >
                  {editable ? (<AiFillSave color="#666" size={18} />) : (<AiFillEdit color="#666" size={18} />)}
                  
                  <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-[#777] transition-all group-hover:w-full"></span>
                </span>
                <span
                  onClick={() => {
                    setOpenConfirmDialog(true);
                  }}
                  className="group relative cursor-pointer px-1 hover:scale-105"
                >
                  <BiTrashAlt size={18} color="#666" />
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

export default TypeOfJobRow;
