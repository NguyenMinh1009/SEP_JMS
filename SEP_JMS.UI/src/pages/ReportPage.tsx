import "react-quill/dist/quill.snow.css";
import "react-multi-carousel/lib/styles.css";
import JobFilterSection from "../components/common/JobFilterSection";
import useFilterInfo from "../hooks/store/useFilterInfo";
import ReportPreview from "../components/report/ReportPreview";
import { useState } from "react";

interface ReportPageProps {
  isInternal?: boolean;
}
const ReportPage: React.FC<ReportPageProps> = () => {
  const [quickSelect, setQuickSelect] = useState<number>(0)
  const filterInfoController = useFilterInfo();
  return (
    <div className="h-full overflow-auto scrollbar-hide">
      <div className="mb-10">
        <div className="flex items-end justify-between gap-3">
          <JobFilterSection report quickSelect={quickSelect}/>

          <div className="flex items-start gap-3">
            <div
              onClick={() => setQuickSelect(1)}
              className="flex cursor-pointer items-center gap-2 rounded-md bg-teal-600 p-3 text-white hover:opacity-75 "
            >
              <span>1 tháng</span>
            </div>
            <div
              onClick={() => setQuickSelect(3)}
              className="flex cursor-pointer items-center gap-2 rounded-md bg-teal-600 p-3 text-white hover:opacity-75 "
            >
              <span>3 tháng</span>
            </div>
            <div
              onClick={() => setQuickSelect(6)}
              className="flex cursor-pointer items-center gap-2 rounded-md bg-teal-600 p-3 text-white hover:opacity-75 "
            >
              <span>6 tháng</span>
            </div>
            <div
              onClick={() => setQuickSelect(12)}
              className="flex cursor-pointer items-center gap-2 rounded-md bg-teal-600 p-3 text-white hover:opacity-75 "
            >
              <span>1 năm</span>
            </div>
          </div>
        </div>
      </div>
      <p className="text-primary mb-6 text-base">Thống kê công việc</p>
      <div className="grid grid-cols-20 items-start gap-2">
        <div className="col-span-full overflow-hidden p-1 pb-20 ">
          <ReportPreview />
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
