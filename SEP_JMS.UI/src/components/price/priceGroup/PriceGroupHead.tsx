import { TableCell, TableHead, TableRow } from "@mui/material";
import { PriceGroupHeadCell } from "../../../interface/table";

const priceGroupHeadCell: readonly PriceGroupHeadCell[] = [
  {
    id: "stt",
    disablePadding: false,
    label: "STT"
  },
  {
    id: "name",
    disablePadding: false,
    label: "Nhóm giá"
  },
  {
    id: "description",
    disablePadding: false,
    label: "Mô tả"
  },
  {
    id: "action",
    disablePadding: false,
    label: "Hành động"
  }
];

const PriceGroupTableHead = () => {
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
        {priceGroupHeadCell.map(headCell => (
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

export default PriceGroupTableHead;
