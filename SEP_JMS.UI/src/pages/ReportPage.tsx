import "react-quill/dist/quill.snow.css";
import "react-multi-carousel/lib/styles.css";
import JobFilterSection from "../components/common/JobFilterSection";
import useFilterInfo from "../hooks/store/useFilterInfo";
import ReportPreview from "../components/report/ReportPreview";

interface ReportPageProps {
  isInternal?: boolean;
}
const ReportPage: React.FC<ReportPageProps> = () => {
  const filterInfoController = useFilterInfo();
  return (
    <div className="h-full overflow-auto scrollbar-hide">
      <div className="mb-10">
        <div className="flex items-end justify-between gap-3">
          <JobFilterSection report />
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
