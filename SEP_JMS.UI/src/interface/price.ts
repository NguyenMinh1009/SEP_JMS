import { JobType } from "../enums/jobType";

export interface PriceGroup {
  priceGroupId: number;
  name: string;
  description: string;
}

export interface PriceItem {
  priceGroupName: string;
  priceId: string;
  jobTypeId: JobType
  unitPrice: number;
  description: string;
}
