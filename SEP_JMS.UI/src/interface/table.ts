import { BasicCompanyType, CompanyResponseType } from "./company";
import { PriceGroup, PriceItem } from "./price";
import { ReportItem } from "./report";
import { Data } from "./taskPreviewData";
import { UsersPreviewData } from "./usersPreviewData";

export interface TaskHeadCell {
  disablePadding: boolean;
  id: keyof Data | "stt" | "type";
  label: string;
}

export interface UsersHeadCell {
  disablePadding: boolean;
  id: Partial<keyof UsersPreviewData> | "stt";
  label: string;
}

export interface CompaniesHeadCell {
  disablePadding: boolean;
  id: Partial<keyof BasicCompanyType> | "stt" | "action" | "account" | "priceGroup";
  label: string;
}

export interface PriceGroupHeadCell {
  disablePadding: boolean;
  id: Partial<keyof PriceGroup> | "stt" | "action";
  label: string;
}

export interface PriceListHeadCell {
  disablePadding: boolean;
  id: Partial<keyof PriceItem> | "stt" | "action";
  label: string;
}

export interface ReportPageHeadCell {
  disablePadding: boolean;
  id: Partial<keyof ReportItem> | "stt";
  label: string;
}
