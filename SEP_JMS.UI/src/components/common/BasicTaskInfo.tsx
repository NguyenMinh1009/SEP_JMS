import React from "react";
import { cn } from "../../utils/className";
import useSideBarPanel from "../../hooks/store/useSideBarPanel";

interface IBasicInfo {
  Icon?: JSX.Element;
  title: string;
  detail: string;
  customText?: string;
}
const BasicTaskInfo: React.FC<IBasicInfo> = ({ Icon, title, detail, customText }) => {
  const sidebar = useSideBarPanel();
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-1 bg-white p-3",
        sidebar.isExpand ? "3xl:flex-row 3xl:items-center" : "2xl:flex-row 2xl:items-center"
      )}
    >
      <div className="flex min-w-[120px] items-center gap-2">
        {Icon && <div className="mb-1">{Icon}</div>}
        <label htmlFor="" className="text-primary">
          {title}
        </label>
      </div>
      <p
        className={`flex w-full overflow-hidden text-ellipsis rounded-md font-[400] leading-5 ${
          customText ?? ""
        }`}
      >
        {detail}
      </p>
    </div>
  );
};

export default BasicTaskInfo;
