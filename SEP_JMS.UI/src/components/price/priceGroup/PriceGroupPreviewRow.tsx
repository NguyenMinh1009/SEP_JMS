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

interface IRowProps {
  row: Partial<PriceGroup>;
  index: number;
  pageSize: number;
  page: number;
  edit?: boolean;
  removePriceGroupPreview: (id: number) => void;
}

const PriceGroupPreviewRow: React.FC<IRowProps> = ({
  row,
  index,
  pageSize,
  page,
  edit,
  removePriceGroupPreview
}) => {
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);

  const navigate = useNavigate();
  const title = useTitle();
  const snakeBar = useSnakeBar();
  const labelId = `enhanced-table-checkbox-${index}`;

  const handleClose = () => {
    setOpenConfirmDialog(false);
  };

  const handleDeletePriceGroup = () => {
    APIClientInstance.delete(`price/group/${row.priceGroupId}`)
      .then(() => {
        removePriceGroupPreview(row.priceGroupId ?? 0);
        snakeBar.setSnakeBar("Xoá nhóm giá thành công!", "success", true);
      })
      .catch(err => {
        if (err?.response?.status === 409) {
          snakeBar.setSnakeBar("Nhóm giá đang được sử dụng!", "error", true);
        }
      });
  };

  if (!row) return <></>;
  return (
    <>
      <CustomDialog
        openDialog={openConfirmDialog}
        handleClose={handleClose}
        title="Bạn có muốn xoá nhóm giá này?"
        description="Nhóm giá đang được sử dụng sẽ không thể xoá!"
        primaryBtnText="Quay trở lại"
        secondaryBtnText="Đồng ý xoá"
        primaryBtnCallback={handleClose}
        secondaryBtnCallback={handleDeletePriceGroup}
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
          {row.name}
        </TableCell>
        <TableCell
          padding="none"
          className={cn("min-w-[80px] border-r-[1px] text-[13px] font-[400]", edit ? "p-1" : "p-2")}
          align="center"
        >
          {edit ? (
            <input type="text" className="h-[26px] w-full border-[1px] px-2" />
          ) : (
            row.description
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
                    title.setContent(row?.name ?? "");
                    navigate(`/${PathString.PRICES}/${row.priceGroupId}`);
                  }}
                  className="group relative cursor-pointer border-r-[1px] border-[#999] px-1 pr-2 hover:scale-105"
                >
                  <HiOutlineEye color="#666" size={18} />
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

export default PriceGroupPreviewRow;
