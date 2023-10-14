import { create } from "zustand";
// import { Role } from "../../enums/role";
import { ICustomer } from "./useCurrentCustomer";
import { IEmployee } from "./useCurrentEmployee";

type IPerson = IEmployee &
  ICustomer & {
    setCurrentPerson?: (person: IPerson) => void;
    hiddenPrice: boolean;
    username: string;
  };

export const defaultPerson: IPerson = {
  userId: "",
  username: "",
  hiddenPrice: true,
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
  token: "",
  idCardNumber: 0,
  address: "",
  onboardTime: 0,
  offboardTime: 0
};

const useCurrentPerson = create<IPerson>(set => ({
  ...defaultPerson,
  setCurrentPerson: (person: IPerson) =>
    set({
      ...person
    }),
  logout: () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
  }
}));

export default useCurrentPerson;
