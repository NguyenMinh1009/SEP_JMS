import React, { useState, useEffect } from "react";
import useSearchJobTitle from "../../hooks/store/useSearchJobTitle";
import { FaSearch } from "react-icons/fa";
import { TaskString } from "../../enums/taskEnums";
import { CorrelationJobType } from "../../enums/correlationJobType";

interface IJobInputSearch {
  isCorrelationJobType: number;
}

const JobInputSearch: React.FC<IJobInputSearch> = ({ isCorrelationJobType }: IJobInputSearch) => {
  const searchJobTitleController = useSearchJobTitle();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    searchJobTitleController.setContent(text);
  };

  return (
    <div className="relative w-1/3">
      <input
        type="text"
        id="search"
        placeholder={
          isCorrelationJobType === CorrelationJobType.Job
            ? TaskString.TIM_KIEM_CONG_VIEC
            : TaskString.TIM_KIEM_DU_AN
        }
        value={searchJobTitleController.content}
        onChange={handleInputChange}
        className="w-full rounded-lg border py-2 pl-2 pr-10 outline-none hover:border-gray-800 focus:border-blue-800"
      />
      <span className="pointer-events-none absolute bottom-5 right-2 flex items-center pl-3">
        <FaSearch className="h-5 w-5 text-gray-400" />
      </span>
    </div>
  );
};

export default JobInputSearch;
