import React, { useEffect, useState } from "react";
import SubTasksProps from "./SubTasksProps";
import { Button, CircularProgress } from "@mui/material";
import AlwayxInstance from "../../../api/AxiosInstance";
import useFilterInfo from "../../../hooks/store/useFilterInfo";
import { JobStatusType } from "../../../enums/jobStatusType";
import { isAny } from "tailwind-merge/dist/lib/validators";
import { useIsFirstRender } from "../../../hooks/useIsFirstRender";
import { VisibleType } from "../../../enums/visibleType";
import TablePagination from "../../common/TablePagination";

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
    if (visibleType === VisibleType.Public) {
      await AlwayxInstance.post("job/all", {
        pageIndex: page,
        pageSize: pageSize,
        parentId: parentId,
        jobStatus: finishedOnly ? JobStatusType.Completed : filterInfoController.content.jobStatus
      }).then(res => {
        setLoading(false);
        setJobs(res.data.items);
        setPageCount(Math.ceil(res.data.count / pageSize));
      });
    } else {
      await AlwayxInstance.post("internal/job/all", {
        pageIndex: page,
        pageSize: pageSize,
        parentId: parentId,
        jobStatus: filterInfoController.content.jobStatus
      }).then(res => {
        setLoading(false);
        setJobs(res.data.items);
        setPageCount(Math.ceil(res.data.count / pageSize));
      });
    }
  };

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
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

  return (
    <div>
      {!isLoading ? (
        finishedOnly ? (
          <div>
            <SubTasksProps tasks={jobs} visibleType={visibleType} finishedOnly />
            <div className="mx-auto mt-8 flex items-center justify-center">
              <TablePagination page={page} pageCount={pageCount} handleChange={handleChange} />
            </div>
          </div>
        ) : (
          <div>
            <SubTasksProps tasks={jobs} visibleType={visibleType} />
            <div className="mx-auto mt-8 flex items-center justify-center">
              <TablePagination page={page} pageCount={pageCount} handleChange={handleChange} />
            </div>
          </div>
        )
      ) : (
        <CircularProgress size={25} />
      )}
    </div>
  );
};

export default SubTasksSection;
