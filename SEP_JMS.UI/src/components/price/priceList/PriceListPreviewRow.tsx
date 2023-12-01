import React from "react";
import { TableCell, TableRow } from "@mui/material";
import { IoCreateOutline } from "react-icons/io5";
import { BiTrashAlt } from "react-icons/bi";
import { PriceItem } from "../../../interface/price";
import { HiOutlineEye } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { PathString } from "../../../enums/MapRouteToBreadCrumb";
import useTitle from "../../../hooks/store/useCurrentTitle";
import { convertVND } from "../../../utils/VNDConvert";
import { cn } from "../../../utils/className";

interface IRowProps {
  row: Partial<PriceItem>;
  index: number;
  pageSize: number;
  page: number;
  edit?: boolean;
  jobTypes: any[];
  handleChangePrice?: (e: React.ChangeEvent) => void;
  handleChangeDescription?: (e: React.ChangeEvent) => void;
}

const PriceListPreviewRow: React.FC<IRowProps> = ({
  row,
  index,
  pageSize,
  page,
  edit,
  jobTypes,
  handleChangePrice,
  handleChangeDescription
}) => {
  const labelId = `enhanced-table-checkbox-${index}`;
  if (!row || !jobTypes.find(item => item.typeId === row.jobTypeId)) return <></>;
  return (
    <TableRow hover role="checkbox" tabIndex={-1} key={row.jobTypeId}>
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
        {row.priceGroupName}
      </TableCell>
      
      
      <TableCell
        padding="none"
        className="min-w-[80px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
        align="center"
      >
        {jobTypes.find(item => item.typeId === row.jobTypeId)?.typeName}
      </TableCell>
      <TableCell
        padding="none"
        className={cn("min-w-[80px] border-r-[1px] text-[13px] font-[400]", edit ? "p-1" : "p-2")}
        align="center"
      >
        {edit ? (
          <input
            type="text"
            className="h-[26px] w-full border-[1px] px-2"
            value={row.description}
            onChange={handleChangeDescription}
          />
        ) : (
          row.description
        )}
      </TableCell>
      <TableCell
        padding="none"
        className={cn("min-w-[80px] border-r-[1px] text-[13px] font-[400]", edit ? "p-1" : "p-2")}
        align="center"
      >
        {edit ? (
          <input
            type="number"
            className="h-[26px] w-full border-[1px] px-2"
            value={row.unitPrice}
            onChange={handleChangePrice}
          />
        ) : (
          convertVND(row.unitPrice)
        )}
      </TableCell>
      {/* <TableCell
        padding="none"
        className="h-full min-w-[100px] justify-center p-2 align-top text-[13px] font-[400] first-letter:items-center"
        align="center"
      >
        <div className="flex h-full w-full items-center justify-center">
          <div className="mx-auto flex gap-1">
            <span
              onClick={() => {}}
              className="group relative cursor-pointer px-1 pr-2 hover:scale-105"
            >
              <IoCreateOutline size={18} />
              <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-[#777] transition-all group-hover:w-full"></span>
            </span>
          </div>
        </div>
      </TableCell> */}
    </TableRow>
  );
};

export default PriceListPreviewRow;
