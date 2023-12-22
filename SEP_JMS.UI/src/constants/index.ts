import { NotificationStatus } from "../enums/NotificationStatus";
import { AccountStatusType } from "../enums/accountStatusType";
import { CorrelationJobType } from "../enums/correlationJobType";
import { CreateRole } from "../enums/createRole";
import { GenderType } from "../enums/genderType";
import { Role } from "../enums/Role";

export const allowFileTypes: string = `image/*, 
application/pdf, 
application/msword, 
application/vnd.ms-excel, 
application/vnd.ms-powerpoint, 
application/vnd.openxmlformats-officedocument.wordprocessingml.document, 
application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, 
application/vnd.openxmlformats-officedocument.presentationml.presentation`;

export const defaultCompany = {
  companyId: "00000000-0000-0000-0000-000000000000",
  companyName: "---",
  companyAddress: "",
  description: ""
};

export const allKey = {
  key: -1,
  text: "Tất cả"
};

export const roleOptions = [
  {
    key: Role.ADMIN,
    text: "Admin"
  },
  {
    key: Role.CUSTOMER,
    text: "Khách hàng"
  },
  {
    key: Role.ACCOUNT,
    text: "Account"
  },
  {
    key: Role.DESIGNER,
    text: "Designer"
  }
];

export const createRoleOptions = [
  {
    key: CreateRole.ADMIN,
    text: "Admin"
  },
  {
    key: CreateRole.CUSTOMER,
    text: "Khách hàng"
  },
  {
    key: CreateRole.ACCOUNT,
    text: "Account"
  },
  {
    key: CreateRole.DESIGNER,
    text: "Designer"
  },
  {
    key: CreateRole.COMPANY,
    text: "Công ty"
  }
];

export const employeeOptions = [
  {
    key: Role.ADMIN,
    text: "Admin"
  },
  {
    key: Role.ACCOUNT,
    text: "Account"
  },
  {
    key: Role.DESIGNER,
    text: "Designer"
  }
];

export const genderOptions = [
  {
    key: GenderType.Male,
    text: "Nam"
  },
  {
    key: GenderType.Female,
    text: "Nữ"
  },
  {
    key: GenderType.Unknown,
    text: "Không rõ"
  }
];

export const accountStatusOptions = [
  {
    key: AccountStatusType.Active,
    text: "Hoạt động"
  },
  {
    key: AccountStatusType.InActive,
    text: "Ngưng hoạt động"
  }
];

export const correlationJobOptions = [
  {
    key: CorrelationJobType.Job,
    text: "Hàng ngày"
  },
  {
    key: CorrelationJobType.Project,
    text: "Dự án"
  }
];

// export const taskPropertiesLabelOptions = [
//   {
//     key: taskPropertiesLabelOptions.StatusTask,
//     text: "Hàng ngày"
//   },
//   {
//     key: CorrelationJobType.Project,
//     text: "Dự án"
//   }
// ];

export const notificationStatusOptions = [
  {
    key: NotificationStatus.ALL,
    text: "Tất cả"
  },
  {
    key: NotificationStatus.UNREAD,
    text: "Chưa đọc"
  },
  {
    key: NotificationStatus.ARCHIVED,
    text: "Lưu trữ"
  }
];

export const commonRegex = {
  email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  phone: /^(0|\+84)\d{9,10}$/,
  password: /^(?=.*\d)(?=.*[!@#$%^&*()_+]).{8,}$/,
  username: /^[a-zA-Z0-9_-]{3,20}$/,
  guid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
};

export const APIUrlHost = "http://localhost:5206";
