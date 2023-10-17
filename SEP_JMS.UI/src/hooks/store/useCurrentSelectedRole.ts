import { create } from "zustand";
import { CreateRole } from "../../enums/createRole";

export interface ISelectedRole {
  selectedRole: CreateRole;
  setRole: (key: CreateRole) => void;
}
const useCurrentSelectedRole = create<ISelectedRole>(set => ({
  selectedRole: CreateRole.CUSTOMER,
  setRole: (key: CreateRole) => set({ selectedRole: key })
}));

export default useCurrentSelectedRole;
