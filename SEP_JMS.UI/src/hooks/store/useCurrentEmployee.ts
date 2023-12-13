import { create } from "zustand";
import { Role } from "../../enums/Role";

export interface IEmployee {
  userId: string;
  avatarUrl?: string;
  fullname: string;
  dob: number;
  email: string;
  phone?: number;
  idCardNumber?: number;
  gender: number;
  address: string;
  onboardTime: number;
  offboardTime?: number;
  roleType?: Role;
  token: string;
  setCurrentEmployee?: (emplyee: IEmployeeParameter) => void;
  logout?: () => void;
}

type IEmployeeParameter = Omit<IEmployee, "Id"> & { employeeId: string };

const useCurrentEmployee = create<IEmployee>(set => ({
  userId: "",
  employeeId: "",
  avatarUrl: "",
  fullname: "",
  dob: 0,
  email: "",
  phone: 0,
  idCardNumber: 0,
  gender: 1,
  address: "",
  onboardTime: 0,
  offboardTime: 0,
  roleType: undefined,
  token: "",
  setCurrentEmployee: (employee: IEmployeeParameter) =>
    set({
      userId: employee.employeeId,
      avatarUrl: employee.avatarUrl,
      fullname: employee.fullname,
      dob: employee.dob,
      email: employee.email,
      phone: employee.phone,
      idCardNumber: employee.idCardNumber,
      gender: employee.gender,
      address: employee.address,
      onboardTime: employee.onboardTime,
      offboardTime: employee.offboardTime,
      roleType: employee.roleType,
      token: employee.token
    }),
  logout: () => localStorage.removeItem("user")
}));

export default useCurrentEmployee;
