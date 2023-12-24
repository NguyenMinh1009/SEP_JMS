import { TableCell, TableHead, TableRow } from "@mui/material";
import { ReportPageHeadCell } from "../../interface/table";

const ReportHeadCell: readonly ReportPageHeadCell[] = [
  {
    id: "stt",
    disablePadding: false,
    label: "STT"
  },
  {
    id: "companyName",
    disablePadding: false,
    label: "Khách hàng"
  },
  {
    id: "totalJobs",
    disablePadding: false,
    label: "Tổng việc"
  },
  {
    id: "expectedProfit",
    disablePadding: false,
    label: "DT ước tính"
  },
  {
    id: "totalFinishedJobs",
    disablePadding: false,
    label: "Việc đã xong"
  },
  {
    id: "totalProfit",
    disablePadding: false,
    label: "DT tạm tính"
  },
  {
    id: "totalPaidJobs",
    disablePadding: false,
    label: "Việc đã thanh toán"
  },
  {
    id: "totalPaid",
    disablePadding: false,
    label: "Doanh thu"
  }
];

const ReportHead = () => {
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
        {ReportHeadCell.map(headCell => (
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

export default ReportHead;
