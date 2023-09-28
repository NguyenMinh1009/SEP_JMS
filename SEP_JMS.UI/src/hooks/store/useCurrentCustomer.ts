import { create } from "zustand";
import { Role } from "../../enums/Role";
import { recursiveStructuredClone } from "../../utils/recursiveStructuredClone";
const defaultCustomer: ICustomer = {
  userId: "",
  roleType: undefined,
  account: {
    userId: "",
    fullname: "",
    dob: 0,
    email: "",
    phone: 0,
    gender: 1,
    address: "",
    onboardTime: 0
  },
  avatarUrl: "",
  fullname: "",
  gender: 1,
  dob: 0,
  phone: 0,
  email: "",
  company: { companyName: "", companyId: "" },
  priceType: 1,
  createdTime: 0,
  token: ""
};

export interface ICustomer {
  roleType?: Role;
  userId: string;
  account: {
    userId: string;
    fullname: string;
    dob: number;
    email: string;
    phone?: number;
    gender: 1;
    address?: string;
    onboardTime: number;
  };
  avatarUrl: string;
  fullname: string;
  gender: 1;
  dob: number;
  phone?: number;
  email: string;
  company?: { companyName: string; companyId: string };
  priceType: 1;
  createdTime: number;
  token: string;
  setCurrentCustomer?: (customer: ICustomerParameter) => void;
  logout?: () => void;
}

type ICustomerParameter = Omit<ICustomer, "Id"> & { customerId: string };

const useCurrentCustomer = create<ICustomer>(set => ({
  ...recursiveStructuredClone(defaultCustomer),
  setCurrentCustomer: (customer: ICustomerParameter) =>
    set({
      userId: customer.userId,
      account: customer.account,
      avatarUrl: customer.avatarUrl,
      fullname: customer.fullname,
      gender: customer.gender,
      dob: customer.dob,
      phone: customer.phone,
      email: customer.email,
      company: customer.company,
      priceType: customer.priceType,
      createdTime: customer.createdTime,
      token: customer.token
    }),
  logout: () => localStorage.removeItem("user")
}));

export default useCurrentCustomer;
