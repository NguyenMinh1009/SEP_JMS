import React from "react";
import { CompaniesHeadCell } from "../../interface/table";
import { TableCell, TableHead, TableRow } from "@mui/material";

const companyHeadCell: readonly CompaniesHeadCell[] = [
  {
    id: "stt",
    disablePadding: false,
    label: "STT"
  },
  {
    id: "companyName",
    disablePadding: false,
    label: "Tên công ty"
  },
  {
    id: "companyAddress",
    disablePadding: false,
    label: "Địa chỉ"
  },
  {
    id: "description",
    disablePadding: false,
    label: "Mô tả"
  },
  {
    id: "account",
    disablePadding: false,
    label: "Account"
  },
  {
    id: "priceGroup",
    disablePadding: false,
    label: "Nhóm giá"
  },
  {
    id: "action",
    disablePadding: false,
    label: "Hành động"
  }
];

const CompanyTableHead = () => {
  return (
    <TableHead className="border-b-0">
      <TableRow
        className="bg-third"
        sx={{
          "& > *:not(:last-child)": {
            borderRight: "2px white solid"
          },
          "& > *": {
            borderBottom: 0
          }
        }}
      >
        {companyHeadCell.map(headCell => (
          <TableCell
            key={headCell.id}
            align="center"
            padding="none"
            className="px-1 py-3 align-top"
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default CompanyTableHead;
