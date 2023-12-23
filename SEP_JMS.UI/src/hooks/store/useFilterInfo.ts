import { create } from "zustand";
import { JobStatusType } from "../../enums/jobStatusType";
import { InternalJobStatusType } from "../../enums/internalJobStatusType";
import { CorrelationJobType } from "../../enums/correlationJobType";
import { JobType } from "../../enums/jobType";
import { PaymentSuccess } from "../../enums/paymentSuccess";

export interface IFilterInfo {
  content: {
    from: number | null;
    to: number | null;
    jobStatus?: JobStatusType | InternalJobStatusType;
    accountId?: string;
    customerId?: string;
    designerId?: string;
    correlationType?: CorrelationJobType;
    companyId?: string;
    jobType?: JobType;
    paymentSuccess?: typeof PaymentSuccess;
  };
  setContent?: (value: any) => void;
  clear?: () => void;
}
const useFilterInfo = create<IFilterInfo>(set => ({
  content: {
    from: 0,
    to: null
  },
  setContent: (filterInfo: any) => set({ content: filterInfo })
}));

export default useFilterInfo;
