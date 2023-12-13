import React, { useState, useEffect } from "react";
import AlwayxInstance from "../api/AxiosInstance";
import useCurrentPerson from "../hooks/store/useCurrentPerson";
import { CircularProgress } from "@mui/material";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TaskPreviewTableRow from "./common/TaskPreviewTableRow";
import TablePagination from "./common/TablePagination";
import EnhancedTableHead from "./common/TaskPreviewTableHead";
import { CorrelationJobType } from "../enums/correlationJobType";
import { VisibleType } from "../enums/visibleType";
import { JobStatusType } from "../enums/jobStatusType";
import { recursiveStructuredClone } from "../utils/recursiveStructuredClone";
import useFilterInfo from "../hooks/store/useFilterInfo";
import { useIsFirstRender } from "../hooks/useIsFirstRender";

interface ITaskPreview {
  sidebar?: boolean;
  isCorrelationJobType: number;
  setPageInfo?: (pageInfo: any) => void;
}

const pageSize = 10;

const InternalTaskPreview = ({ sidebar, setPageInfo, isCorrelationJobType }: ITaskPreview) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [pageCount, setPageCount] = React.useState<number>(0);
  const [page, setPage] = React.useState(1);

  const isFirstRender = useIsFirstRender();
  const filterInfoController = useFilterInfo();

  const getJobs = async () => {
    setLoading(true);
    await AlwayxInstance.post("internal/job/all", {
      pageIndex: page,
      pageSize: pageSize,
      searchText: "",
      ...filterInfoController.content
    }).then(res => {
      setLoading(false);
      setJobs(res.data.items);
      setPageCount(Math.ceil(res.data.count / pageSize));
    });
  };

  const getProjects = async () => {
    setLoading(true);
    await AlwayxInstance.post("internal/job/allprojects", {
      pageIndex: page,
      pageSize: pageSize,
      searchText: "",
      ...filterInfoController.content
    }).then(res => {
      setLoading(false);
      setJobs(res.data.items);
      setPageCount(Math.ceil(res.data.count / pageSize));
    });
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const removeTaskPreview = (taskId: string) => {
    const taskClone = recursiveStructuredClone(jobs);
    const currentTaskIndex = taskClone.findIndex(task => task.jobId === taskId);
    if (currentTaskIndex > -1) {
      taskClone.splice(currentTaskIndex, 1);
    }
    setJobs(taskClone);
  };

  useEffect(() => {
    if (isCorrelationJobType === CorrelationJobType.Job) {
      getJobs();
    } else {
      getProjects();
    }
    setPageInfo?.({ page: page, pageSize: pageSize });
  }, [page]);

  useEffect(() => {
    if (!isFirstRender) {
      if (page !== 1) setPage(1);
      else {
        isCorrelationJobType === CorrelationJobType.Project ? getProjects() : getJobs();
      }
    }
  }, [filterInfoController.content, isCorrelationJobType]);

  return !isLoading ? (
    <div>
      {jobs?.length > 0 ? (
        <>
          <Box
            sx={{ width: "100%" }}
            className="task-preview-container max-h-[calc(100vh-360px)] overflow-y-auto rounded-sm shadow-md "
          >
            <TableContainer>
              {/* --Job-- */}
              {isCorrelationJobType === CorrelationJobType.Job ? (
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
                  <EnhancedTableHead correlationJobType={CorrelationJobType.Job} />
                  <TableBody>
                    {jobs
                      .filter(job => job.internalJobStatus !== JobStatusType.Completed)
                      ?.map((row: any, index: number) => {
                        return (
                          <TaskPreviewTableRow
                            visibleType={VisibleType.Internal}
                            correlationJobType={CorrelationJobType.Job}
                            key={JSON.stringify(row)}
                            index={index}
                            row={row}
                            page={page}
                            pageSize={pageSize}
                            removeTaskPreview={removeTaskPreview}
                          />
                        );
                      })}
                  </TableBody>
                </Table>
              ) : (
                // ----Project----
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
                  <EnhancedTableHead correlationJobType={CorrelationJobType.Project} />
                  <TableBody>
                    {jobs
                      .filter(job => job.internalJobStatus !== JobStatusType.Completed)
                      ?.map((row: any, index: number) => {
                        return (
                          <TaskPreviewTableRow
                            visibleType={VisibleType.Internal}
                            correlationJobType={CorrelationJobType.Project}
                            key={JSON.stringify(row)}
                            index={index}
                            row={row}
                            page={page}
                            pageSize={pageSize}
                            removeTaskPreview={removeTaskPreview}
                          />
                        );
                      })}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Box>
          <div className="mx-auto mt-8 flex items-center justify-center">
            <TablePagination page={page} pageCount={pageCount} handleChange={handleChange} />
          </div>
        </>
      ) : isCorrelationJobType === CorrelationJobType.Job ? (
        <div>Chưa có công việc để hiển thị</div>
      ) : (
        <div>Chưa có dự án để hiển thị</div>
      )}
    </div>
  ) : (
    <CircularProgress size={25} />
  );
};

export default React.memo(InternalTaskPreview);
