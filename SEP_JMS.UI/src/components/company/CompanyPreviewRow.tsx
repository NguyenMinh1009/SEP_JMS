import React from "react";
import { CompanyResponseType } from "../../interface/company";
import { TableCell, TableRow } from "@mui/material";
import { IoCreateOutline } from "react-icons/io5";
import { BiTrashAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { PathString } from "../../enums/MapRouteToBreadCrumb";

interface IRowProps {
  row: Partial<CompanyResponseType>;
  index: number;
  pageSize: number;
  page: number;
}

const CompanyPreviewRow: React.FC<IRowProps> = ({ row, index, pageSize, page }) => {
  const labelId = `enhanced-table-checkbox-${index}`;
  const navigate = useNavigate();
  if (!row) return <></>;
  return (
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
                    `/${PathString.USERS}/${PathString.COMPANY}/${row.company?.companyId ?? ""}/${
                      PathString.CHINH_SUA
                    }`
                  );
                }}
                className="group relative cursor-pointer border-[#999] px-1 hover:scale-105"
              >
                <IoCreateOutline size={18} />
                <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-[#777] transition-all group-hover:w-full"></span>
              </span>
              {/* <span
                // onClick={handleClickDeleteTask}
                className="group relative cursor-pointer border-[#999] px-1 hover:scale-105"
              >
                <BiTrashAlt size={18} color="#666" />
                <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-[#777] transition-all group-hover:w-full"></span>
              </span> */}
            </>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default CompanyPreviewRow;
