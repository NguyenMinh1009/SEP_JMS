import React from "react";
import { TableCell, TableRow } from "@mui/material";
import { ReportItem } from "../../interface/report";

interface IRowProps {
  row: Partial<ReportItem>;
  index: number;
}

const ReportPreviewRow: React.FC<IRowProps> = ({ row, index }) => {
  const labelId = `enhanced-table-checkbox-${index}`;
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
        {index + 1}
      </TableCell>
      <TableCell
        padding="none"
        className="min-w-[80px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
        align="center"
      >
        {row.companyName}
      </TableCell>
      <TableCell
        padding="none"
        className="min-w-[80px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
        align="center"
      >
        {row.totalJobs}
      </TableCell>
      <TableCell
        padding="none"
        className="min-w-[80px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
        align="center"
      >
        {row.expectedProfit?.toLocaleString('vi-VN')}
      </TableCell> 
      <TableCell
        padding="none"
        className="min-w-[80px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
        align="center"
      >
        {row.totalFinishedJobs}
      </TableCell>
      <TableCell
        padding="none"
        className="min-w-[80px] border-r-[1px] p-2 align-top text-[13px] font-[400]"
        align="center"
      >
        {row.totalProfit?.toLocaleString('vi-VN')}
      </TableCell>
    </TableRow>
  );
};

export default ReportPreviewRow;
