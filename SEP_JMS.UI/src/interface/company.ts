import { CompanyStatusType } from "../enums/companytStatusType";
import { PriceGroup } from "./price";
import { UsersPreviewData } from "./usersPreviewData";

export interface BasicCompanyType {
  companyId: string;
  companyName: string;
  companyAddress: string;
  description: string;
  companyStatus: CompanyStatusType;
}
export interface CompanyResponseType {
  company: BasicCompanyType;
  account: UsersPreviewData;
  priceGroup: PriceGroup;
}
