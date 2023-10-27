import { TableCell, TableHead, TableRow } from "@mui/material";
import { PriceListHeadCell } from "../../../interface/table";

const companyHeadCell: readonly PriceListHeadCell[] = [
  {
    id: "stt",
    disablePadding: false,
    label: "STT"
  },
  {
    id: "priceGroupName",
    disablePadding: false,
    label: "Nhóm giá"
  },
  {
    id: "jobTypeId",
    disablePadding: false,
    label: "Loại thiết kế"
  },
  {
    id: "description",
    disablePadding: false,
    label: "Mô tả"
  },
  {
    id: "unitPrice",
    disablePadding: false,
    label: "Đơn vị giá"
  },
  // {
  //   id: "action",
  //   disablePadding: false,
  //   label: "Hành động"
  // }
];

const PriceListTableHead = () => {
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

export default PriceListTableHead;
