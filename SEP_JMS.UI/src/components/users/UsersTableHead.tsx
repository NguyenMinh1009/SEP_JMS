import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { UsersHeadCell } from "../../interface/table";
import { CorrelationJobType } from "../../enums/correlationJobType";
import useCurrentPerson from "../../hooks/store/useCurrentPerson";
import { Role } from "../../enums/Role";

interface EnhancedTableProps {
  role: Role;
}

const customerHeadCell: readonly UsersHeadCell[] = [
  {
    id: "stt",
    disablePadding: false,
    label: "STT"
  },
  {
    id: "accountStatus",
    disablePadding: false,
    label: "Trạng thái"
  },
  {
    id: "fullname",
    disablePadding: false,
    label: "Tên"
  },
  {
    id: "username",
    disablePadding: false,
    label: "Tài khoản"
  },
  {
    id: "company",
    disablePadding: false,
    label: "Công ty"
  },
  {
    id: "createdTime",
    disablePadding: false,
    label: "Ngày tạo"
  },
  {
    id: "dob",
    disablePadding: false,
    label: "Ngày sinh"
  },
  {
    id: "email",
    disablePadding: false,
    label: "Email"
  },
  {
    id: "gender",
    disablePadding: false,
    label: "Giới tính"
  },
  {
    id: "hiddenPrice",
    disablePadding: false,
    label: "Hiện giá"
  },
  {
    id: "phone",
    disablePadding: false,
    label: "SĐT"
  },
  {
    id: "roleType",
    disablePadding: false,
    label: "Loại TK"
  },

  {
    id: "action",
    disablePadding: false,
    label: "Hành động"
  }
];

const employeeHeadCell: readonly UsersHeadCell[] = [
  {
    id: "stt",
    disablePadding: false,
    label: "STT"
  },
  {
    id: "accountStatus",
    disablePadding: false,
    label: "Trạng thái"
  },
  {
    id: "fullname",
    disablePadding: false,
    label: "Tên"
  },
  {
    id: "username",
    disablePadding: false,
    label: "Tài khoản"
  },
  {
    id: "address",
    disablePadding: false,
    label: "Địa chỉ"
  },
  {
    id: "createdTime",
    disablePadding: false,
    label: "Ngày tạo"
  },
  {
    id: "dob",
    disablePadding: false,
    label: "Ngày sinh"
  },
  {
    id: "email",
    disablePadding: false,
    label: "Email"
  },
  {
    id: "gender",
    disablePadding: false,
    label: "Giới tính"
  },
  {
    id: "idCardNumber",
    disablePadding: false,
    label: "Mã thẻ"
  },
  {
    id: "onboardTime",
    disablePadding: false,
    label: "Ngày vào"
  },
  {
    id: "offboardTime",
    disablePadding: false,
    label: "Ngày nghỉ"
  },
  {
    id: "phone",
    disablePadding: false,
    label: "SĐT"
  },
  {
    id: "roleType",
    disablePadding: false,
    label: "Loại TK"
  },
  {
    id: "action",
    disablePadding: false,
    label: "Hành động"
  }
];

const UsersTableHead: React.FC<EnhancedTableProps> = ({ role }) => {
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
        {(role === Role.CUSTOMER ? customerHeadCell : employeeHeadCell)?.map(headCell => (
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

export default UsersTableHead;
