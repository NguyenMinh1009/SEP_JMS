import { GenderType } from "../enums/genderType";
import { Role } from "../enums/role";

export interface UsersPreviewData {
  accountStatus: number;
  address?: string;
  avatarUrl?: string;
  company?: any;
  createdTime: number;
  dob: number;
  email: string;
  fullname: string;
  gender: GenderType;
  hiddenPrice: boolean;
  idCardNumber: number;
  offboardTime?: number ;
  onboardTime?: number;
  phone?: string;
  roleType: Role;
  userId: string;
  username: string;
  action: JSX.Element;
}
