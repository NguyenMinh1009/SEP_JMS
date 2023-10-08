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

  const getJobs = async () => {
    setLoading(true);
    await AlwayxInstance.post("job/all", {
      pageIndex: page,
      pageSize: pageSize,
      searchText: "",
      ...filterInfoController.content,
      jobStatus: finishedOnly ? JobStatusType.Completed : filterInfoController.content.jobStatus,
      correlationType: isCorrelationJobType
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
  }, [filterInfoController.content]);

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
                  <EnhancedTableHead correlationJobType={CorrelationJobType.Job} />
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
                  <EnhancedTableHead correlationJobType={CorrelationJobType.Project} />
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
