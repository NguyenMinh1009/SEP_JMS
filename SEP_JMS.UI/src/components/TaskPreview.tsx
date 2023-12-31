import React, { useState, useEffect } from "react";
import AlwayxInstance from "../api/AxiosInstance";
import { CircularProgress } from "@mui/material";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TaskPreviewTableRow from "./common/TaskPreviewTableRow";
import TablePagination from "./common/TablePagination";
import EnhancedTableHead from "./common/TaskPreviewTableHead";
import { VisibleType } from "../enums/visibleType";
import { CorrelationJobType } from "../enums/correlationJobType";
import { recursiveStructuredClone } from "../utils/recursiveStructuredClone";
import useFilterInfo from "../hooks/store/useFilterInfo";
import { useIsFirstRender } from "../hooks/useIsFirstRender";
import { JobStatusType } from "../enums/jobStatusType";
import useSearchJobTitle from "../hooks/store/useSearchJobTitle";

interface ITaskPreview {
  sidebar?: boolean;
  finishedOnly?: boolean;
  setPageInfo?: (pageInfo: any) => void;
  isCorrelationJobType: number;
}

const pageSize = 10;

const TaskPreview = ({ finishedOnly, setPageInfo, isCorrelationJobType }: ITaskPreview) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [pageCount, setPageCount] = React.useState<number>(0);
  const [page, setPage] = React.useState(1);

  const isFirstRender = useIsFirstRender();
  const filterInfoController = useFilterInfo();
  const searchJobTitleController = useSearchJobTitle();

  const getFilterContent = () => {
    if (!isFirstRender) return filterInfoController.content;
    return {
      from: 0,
      to: null
    }
  }

  const getJobs = async () => {
    setLoading(true);
    await AlwayxInstance.post("job/all", {
      pageIndex: page,
      pageSize: pageSize,
      searchText: searchJobTitleController.content,
      ...getFilterContent()
    }).then(res => {
      setLoading(false);
      setJobs(res.data.items);
      setPageCount(Math.ceil(res.data.count / pageSize));
    });
  };
  const getCompletedJobs = async () => {
    setLoading(true);
    await AlwayxInstance.post("job/all", {
      pageIndex: page,
      pageSize: pageSize,
      searchText: searchJobTitleController.content,
      ...getFilterContent(),
      jobStatus: JobStatusType.Completed
    }).then(res => {
      setLoading(false);
      setJobs(res.data.items);
      setPageCount(Math.ceil(res.data.count / pageSize));
    });
  };

  const getProjects = async () => {
    setLoading(true);
    await AlwayxInstance.post("job/allprojects", {
      pageIndex: page,
      pageSize: pageSize,
      searchText: searchJobTitleController.content,
      ...getFilterContent()
    }).then(res => {
      setLoading(false);
      setJobs(res.data.items);
      setPageCount(Math.ceil(res.data.count / pageSize));
    });
  };
  const getCompletedProjects = async () => {
    setLoading(true);
    await AlwayxInstance.post("job/allprojects", {
      pageIndex: page,
      pageSize: pageSize,
      searchText: searchJobTitleController.content,
      ...getFilterContent(),
      jobStatus: JobStatusType.Completed
    }).then(res => {
      setLoading(false);
      setJobs(res.data.items);
      setPageCount(Math.ceil(res.data.count / pageSize));
    });
  };

  const removeTaskPreview = (taskId: string) => {
    const taskClone = recursiveStructuredClone(jobs);
    const currentTaskIndex = taskClone.findIndex(task => task.jobId === taskId);
    if (currentTaskIndex > -1) {
      taskClone.splice(currentTaskIndex, 1);
    }
    setJobs(taskClone);
  };

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
      if (isCorrelationJobType === CorrelationJobType.Job) {
        finishedOnly ? getCompletedJobs() : getJobs();
      } else {
        finishedOnly ? getCompletedProjects() : getProjects();
      }
  }, [page]);

  useEffect(() => {
    if (!isFirstRender) {
      if (page !== 1) setPage(1);
      else {
        if (isCorrelationJobType === CorrelationJobType.Project) {
          finishedOnly ? getCompletedProjects() : getProjects();
        } else {
          finishedOnly ? getCompletedJobs() : getJobs();
        }
      }
    }
  }, [filterInfoController.content, isCorrelationJobType, searchJobTitleController.content]);

  return !isLoading ? (
    <div>
      {jobs?.length > 0 ? (
        <>
          <Box
            sx={{ width: "100%" }}
            className="task-preview-container max-h-[calc(100vh-360px)] overflow-y-auto rounded-sm shadow-md "
          >
            <TableContainer>
              {/* ---JOB--- */}
              {isCorrelationJobType === CorrelationJobType.Job && (
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
                  {finishedOnly ? (
                    <EnhancedTableHead finishedOnly correlationJobType={CorrelationJobType.Job} />
                  ) : (
                    <EnhancedTableHead correlationJobType={CorrelationJobType.Job} />
                  )}
                  <TableBody>
                    {jobs?.map((row: any, index: number) => {
                      return (
                        <TaskPreviewTableRow
                          finishOnly={finishedOnly}
                          index={index}
                          visibleType={VisibleType.Public}
                          correlationJobType={CorrelationJobType.Job}
                          key={JSON.stringify(row)}
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
              {/* ---PROJECT--- */}
              {isCorrelationJobType === CorrelationJobType.Project && (
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
                  {finishedOnly ? (
                    <EnhancedTableHead
                      finishedOnly
                      correlationJobType={CorrelationJobType.Project}
                    />
                  ) : (
                    <EnhancedTableHead correlationJobType={CorrelationJobType.Project} />
                  )}
                  <TableBody>
                    {jobs?.map((row: any, index: number) => {
                      return (
                        <TaskPreviewTableRow
                          finishOnly={finishedOnly}
                          index={index}
                          visibleType={VisibleType.Public}
                          correlationJobType={CorrelationJobType.Project}
                          key={JSON.stringify(row)}
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
      ) : (
        <div>{finishedOnly ? "Chưa có công việc hoàn thành" : "Chưa có công việc để hiển thị"}</div>
      )}
    </div>
  ) : (
    <CircularProgress size={25} />
  );
};

export default React.memo(TaskPreview);
