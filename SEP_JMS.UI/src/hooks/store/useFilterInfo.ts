import { State, create } from "zustand";
import { JobStatusType } from "../../enums/jobStatusType";
import { InternalJobStatusType } from "../../enums/internalJobStatusType";
import { CorrelationJobType } from "../../enums/correlationJobType";
import { JobType } from "../../enums/jobType";
import { PaymentSuccess } from "../../enums/paymentSuccess";
import { devtools } from "zustand/middleware";

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
    jobType?: string;
    paymentSuccess?: typeof PaymentSuccess;
  };
  setContent?: (value: any) => void;
  clear: () => void;
}

const useFilterInfo = create<IFilterInfo>(set => ({
  content: {
    from: 0,
    to: null
  },
  setContent: (filterInfo: any) => set({ content: filterInfo }),
  clear: () => set({ content: { from: 0, to: null } })
}));

export default useFilterInfo;
