import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { TaskHeadCell } from "../../interface/table";
import { CorrelationJobType } from "../../enums/correlationJobType";
import useCurrentPerson from "../../hooks/store/useCurrentPerson";

interface EnhancedTableProps {
  correlationJobType: CorrelationJobType;
  finishedOnly?: boolean;
}

const jobHeadCells: readonly TaskHeadCell[] = [
  {
    id: "stt",
    disablePadding: false,
    label: "STT"
  },
  // {
  //   id: "type",
  //   disablePadding: false,
  //   label: "Loại"
  // },
  {
    id: "customer",
    disablePadding: false,
    label: "Tên KH"
  },
  {
    id: "createdBy",
    disablePadding: false,
    label: "Người ĐH"
  },
  {
    id: "title",
    disablePadding: false,
    label: "Tiêu đề"
  },
  {
    id: "account",
    disablePadding: false,
    label: "Account"
  },
  {
    id: "designer",
    disablePadding: false,
    label: "NTK"
  },
  {
    id: "jobType",
    disablePadding: false,
    label: "Loại thiết kế"
  },
  {
    id: "quantity",
    disablePadding: false,
    label: "SL"
  },
  {
    id: "createdDate",
    disablePadding: false,
    label: "Ngày tạo"
  },
  {
    id: "deadline",
    disablePadding: false,
    label: "Hạn cuối"
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

const projectHeadCells: readonly TaskHeadCell[] = [
  {
    id: "stt",
    disablePadding: false,
    label: "STT"
  },
  {
    id: "customer",
    disablePadding: false,
    label: "Tên KH"
  },
  {
    id: "createdBy",
    disablePadding: false,
    label: "Người ĐH"
  },
  {
    id: "title",
    disablePadding: false,
    label: "Tiêu đề"
  },
  {
    id: "account",
    disablePadding: false,
    label: "Account"
  },
  {
    id: "jobType",
    disablePadding: false,
    label: "Loại thiết kế"
  },
  // {
  //   id: "price",
  //   disablePadding: false,
  //   label: "Giá"
  // },
  {
    id: "createdDate",
    disablePadding: false,
    label: "Ngày tạo"
  },
  {
    id: "deadline",
    disablePadding: false,
    label: "Hạn cuối"
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

const finishedJobHeadCells: readonly TaskHeadCell[] = [
  {
    id: "stt",
    disablePadding: false,
    label: "STT"
  },
  {
    id: "customer",
    disablePadding: false,
    label: "Tên KH"
  },
  {
    id: "createdBy",
    disablePadding: false,
    label: "Người ĐH"
  },
  {
    id: "title",
    disablePadding: false,
    label: "Tiêu đề"
  },
  {
    id: "account",
    disablePadding: false,
    label: "Account"
  },
  {
    id: "designer",
    disablePadding: false,
    label: "NTK"
  },
  {
    id: "jobType",
    disablePadding: false,
    label: "Loại thiết kế"
  },
  {
    id: "quantity",
    disablePadding: false,
    label: "SL"
  },
  {
    id: "createdDate",
    disablePadding: false,
    label: "Ngày tạo"
  },
  {
    id: "deadline",
    disablePadding: false,
    label: "Hạn cuối"
  },
  {
    id: "priority",
    disablePadding: false,
    label: "Ưu tiên"
  },
  {
    id: "paymentSuccess",
    disablePadding: false,
    label: "TT Thanh Toán"
  },
  {
    id: "action",
    disablePadding: false,
    label: "Hành động"
  }
];

const finishedProjectHeadCells: readonly TaskHeadCell[] = [
  {
    id: "stt",
    disablePadding: false,
    label: "STT"
  },
  {
    id: "customer",
    disablePadding: false,
    label: "Tên KH"
  },
  {
    id: "createdBy",
    disablePadding: false,
    label: "Người ĐH"
  },
  {
    id: "title",
    disablePadding: false,
    label: "Tiêu đề"
  },
  {
    id: "account",
    disablePadding: false,
    label: "Account"
  },
  {
    id: "jobType",
    disablePadding: false,
    label: "Loại thiết kế"
  },
  // {
  //   id: "price",
  //   disablePadding: false,
  //   label: "Giá"
  // },
  {
    id: "createdDate",
    disablePadding: false,
    label: "Ngày tạo"
  },
  {
    id: "deadline",
    disablePadding: false,
    label: "Hạn cuối"
  },
  {
    id: "priority",
    disablePadding: false,
    label: "Ưu tiên"
  },
  {
    id: "paymentSuccess",
    disablePadding: false,
    label: "TT Thanh Toán"
  },
  {
    id: "action",
    disablePadding: false,
    label: "Hành động"
  }
];

const EnhancedTableHead: React.FC<EnhancedTableProps> = ({ correlationJobType, finishedOnly }) => {
  const currentPerson = useCurrentPerson();
  const getHeaderCells = () => {
    if (correlationJobType === CorrelationJobType.Job) {
      if (finishedOnly) return finishedJobHeadCells;
      else return jobHeadCells;
    } else {
      if (finishedOnly) return finishedProjectHeadCells;
      else return projectHeadCells;
    }
  };
  let headerCells = getHeaderCells();
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
        {headerCells.map(headCell => (
          <TableCell key={headCell.id} align="center" padding="none" className="px-1 py-3">
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default EnhancedTableHead;
