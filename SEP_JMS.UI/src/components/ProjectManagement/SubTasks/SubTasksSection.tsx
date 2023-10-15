import React, { useEffect, useState } from "react";
import SubTasksProps from "./SubTasksProps";
import { Button } from "@mui/material";
import AlwayxInstance from "../../../api/AxiosInstance";
import useFilterInfo from "../../../hooks/store/useFilterInfo";
import { JobStatusType } from "../../../enums/jobStatusType";
import { isAny } from "tailwind-merge/dist/lib/validators";
import { useIsFirstRender } from "../../../hooks/useIsFirstRender";
import { VisibleType } from "../../../enums/visibleType";

interface ISubTasksSection {
  finishedOnly?: boolean;
  setPageInfo?: (pageInfo: any) => void;
  parentId: any;
  visibleType: VisibleType;
}

const pageSize = 5;

const SubTasksSection = ({
  finishedOnly,
  setPageInfo,
  parentId,
  visibleType
}: //
ISubTasksSection) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [pageCount, setPageCount] = React.useState<number>(0);
  const [page, setPage] = React.useState(1);
  const isFirstRender = useIsFirstRender();
  const filterInfoController = useFilterInfo();

  const getJobs = async () => {
    setLoading(true);
    await AlwayxInstance.post("job/all", {
      pageIndex: page,
      pageSize: pageSize,
      parentId: parentId,
      jobStatus: finishedOnly ? JobStatusType.Completed : null
    }).then(res => {
      setLoading(false);
      setJobs(res.data.items);
      setPageCount(Math.ceil(res.data.count / pageSize));
    });
  };
  useEffect(() => {
    getJobs();
    setPageInfo?.({ page: page, pageSize: pageSize });
  }, [page]);

  useEffect(() => {
    if (!isFirstRender) {
      if (page !== 1) setPage(1);
      else {
        getJobs();
      }
    }
  }, []);

  return <div>{!isLoading && <SubTasksProps tasks={jobs} visibleType={visibleType} />}</div>;
};

export default SubTasksSection;
