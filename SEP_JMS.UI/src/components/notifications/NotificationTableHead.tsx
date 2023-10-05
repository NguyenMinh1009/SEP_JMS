import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { TaskHeadCell } from "../../interface/table";
import { CorrelationJobType } from "../../enums/correlationJobType";
import useCurrentPerson from "../../hooks/store/useCurrentPerson";

interface EnhancedTableProps {
  status: number;
}

interface NotifyHeadCell {
	disablePadding: boolean;
	id: string;
	label: string
}

const notifyHeadCells: readonly NotifyHeadCell[] = [
  {
    id: "stt",
    disablePadding: false,
    label: "STT"
  },
  {
    id: "EntityName",
    disablePadding: false,
    label: "Loại"
  },
  {
    id: "title",
    disablePadding: false,
    label: "Tiêu đề"
  },
  {
    id: "message",
    disablePadding: false,
    label: "Nội dung"
  },
  {
    id: "createdDate",
    disablePadding: false,
    label: "Ngày tạo"
  },
  {
    id: "triggerBy",
    disablePadding: false,
    label: "TriggerBy"
  },
  {
    id: "priority",
    disablePadding: false,
    label: "Ưu tiên"
  },
  {
    id: "status",
    disablePadding: false,
    label: "Trạng thái"
  },
  {
    id: "action",
    disablePadding: false,
    label: "Hành động"
  }
];



const NotifcationTableHead: React.FC<EnhancedTableProps> = ({ status }) => {
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
        {notifyHeadCells.map(headCell => (
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

export default NotifcationTableHead;
