import React from "react";
import { FaArrowLeft } from "react-icons/fa";

interface IProjectParentSection {
  action: string;
  // projectId: any;
  // subTaskId: any;
  titleProject: string;
  titleSubTask: string;
}
const ProjectParentSection: React.FC<IProjectParentSection> = ({
  action,
  titleProject,
  titleSubTask
}) => {
  return (
    <div>
      <div className="`mb-[2px] flex min-w-0 items-center">
        <FaArrowLeft size={18} color="#0655a7" />
        <div className="text-primary ml-2 text-lg font-semibold text-[#0655a7]">hihihihihih</div>
      </div>
    </div>
  );
};
export default ProjectParentSection;
