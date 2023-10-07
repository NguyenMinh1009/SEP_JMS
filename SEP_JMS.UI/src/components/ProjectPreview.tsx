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
import { JobStatusType } from "../enums/jobStatusType";
import { VisibleType } from "../enums/visibleType";
import { recursiveStructuredClone } from "../utils/recursiveStructuredClone";
import { useIsFirstRender } from "../hooks/useIsFirstRender";
import useFilterInfo from "../hooks/store/useFilterInfo";

interface ITaskPreview {
  sidebar?: boolean;
  finishedOnly?: boolean;
}

const pageSize = 10;

const ProjectPreview = ({ finishedOnly }: ITaskPreview) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [pageCount, setPageCount] = React.useState<number>(0);
  const [page, setPage] = React.useState(1);
  const isFirstRender = useIsFirstRender();
  const filterInfoController = useFilterInfo();

  const currentPerson = useCurrentPerson();

  const getJobs = async () => {
    setLoading(true);
    await AlwayxInstance.post("job/all", {
      pageIndex: page,
      pageSize: pageSize,
      searchText: "",
      ...filterInfoController.content,
      jobStatus: finishedOnly ? JobStatusType.Completed : filterInfoController.content.jobStatus,
      correlationType: 2
    }).then(res => {
      setLoading(false);
      setProjects(res.data.items);
      setPageCount(Math.ceil(res.data.count / pageSize));
    });
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const removeTaskPreview = (taskId: string) => {
    const taskClone = recursiveStructuredClone(projects);
    const currentTaskIndex = taskClone.findIndex(project => project.jobId === taskId);
    if (currentTaskIndex > -1) {
      taskClone.splice(currentTaskIndex, 1);
    }
    setProjects(taskClone);
  };

  useEffect(() => {
    getJobs();
  }, []);

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
      {projects?.length > 0 ? (
        <>
          <Box
            sx={{ width: "100%" }}
            className="task-preview-container max-h-[calc(100vh-360px)] overflow-y-auto rounded-sm shadow-md "
          >
            <TableContainer>
              <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
                <EnhancedTableHead correlationJobType={CorrelationJobType.Project} />
                <TableBody>
                  {(finishedOnly
                    ? projects
                    : projects.filter(project => project.jobStatus !== JobStatusType.Completed)
                  )?.map((row: any, index: number) => {
                    return (
                      <TaskPreviewTableRow
                        visibleType={VisibleType.Public}
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
            </TableContainer>
          </Box>
          <div className="mx-auto mt-8 flex items-center justify-center">
            <TablePagination page={page} pageCount={pageCount} handleChange={handleChange} />
          </div>
        </>
      ) : (
        <div>{finishedOnly ? "Chưa có dự án hoàn thành" : "Chưa có dự án để hiển thị"}</div>
      )}
    </div>
  ) : (
    <CircularProgress size={25} />
  );
};

export default React.memo(ProjectPreview);
