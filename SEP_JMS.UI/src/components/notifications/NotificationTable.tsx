import React, { useState, useEffect } from "react";
import AlwayxInstance from "../../api/AxiosInstance";
import { CircularProgress } from "@mui/material";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TaskPreviewTableRow from "../common/TaskPreviewTableRow";
import TablePagination from "../common/TablePagination";
import EnhancedTableHead from "../common/TaskPreviewTableHead";
import { VisibleType } from "../../enums/visibleType";
import { CorrelationJobType } from "../../enums/correlationJobType";
import { recursiveStructuredClone } from "../../utils/recursiveStructuredClone";
import useFilterInfo from "../../hooks/store/useFilterInfo";
import { useIsFirstRender } from "../../hooks/useIsFirstRender";
import { JobStatusType } from "../../enums/jobStatusType";
import NotifcationTableHead from "./NotificationTableHead";
import NotificationTableRow from "./NotificationTableRow";
interface INotifyPreview {
  searchValue: string;
}

const pageSize = 10;

const NotificationTable: React.FC<INotifyPreview> = ({ searchValue }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [pageCount, setPageCount] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(1);

  const isFirstRender = useIsFirstRender();

  const getUsers = async () => {
    let testData: Array<any> = [
      {
        entityName: "Job",
        title: "Bạn có một công việc mới!!!",
        message: "[ThaiNv] vừa assign cho bạn một công việc",
        createdTime: 1696500452908,
        readAt: null,
      },
      {
        entityName: "Comment",
        title: "Bạn có một công việc mới!!!",
        message: "[TuanTX] vừa comment vào công việc [AJTLLL]",
        createdTime: 1696500452908,
        readAt: null,
      },
      {
        entityName: "Comment",
        title: "Bạn có một công việc mới!!!",
        message: "[MinhNN] vừa comment vào công việc [AJTLLL]",
        createdTime: 1696500452908,
        readAt: null,
      },
      {
        entityName: "Comment",
        title: "Bạn có một công việc mới!!!",
        message: "[PhuongNT] vừa comment vào công việc [AJTLLL]",
        createdTime: 1696500452908,
        readAt: null,
      },
      {
        entityName: "Comment",
        title: "Bạn có một công việc mới!!!",
        message: "[ThaiNv] vừa comment vào công việc [AJTLLL]",
        createdTime: 1696500452908,
        readAt: null,
      },
      {
        entityName: "Comment",
        title: "Bạn có một công việc mới!!!",
        message: "[ThaiNv] vừa comment vào công việc [AJTLLL]",
        createdTime: 1696500452908,
        readAt: null,
      },
      {
        entityName: "Comment",
        title: "Bạn có một công việc mới!!!",
        message: "[ThaiNv] vừa comment vào công việc [AJTLLL]",
        createdTime: 1696500452908,
        readAt: null,
      },{
        entityName: "Comment",
        title: "Bạn có một công việc mới!!!",
        message: "[ThaiNv] vừa comment vào công việc [AJTLLL]",
        createdTime: 1696500452908,
        readAt: null,
      },
      {
        entityName: "Comment",
        title: "Bạn có một công việc mới!!!",
        message: "[ThaiNv] vừa comment vào công việc [AJTLLL]",
        createdTime: 1696500452908,
        readAt: null,
      },
      {
        entityName: "Comment",
        title: "Bạn có một công việc mới!!!",
        message: "[ThaiNv] vừa comment vào công việc [AJTLLL]",
        createdTime: 1696500452908,
        readAt: null,
      },
      {
        entityName: "Comment",
        title: "Bạn có một công việc mới!!!",
        message: "[ThaiNv] vừa comment vào công việc [AJTLLL]",
        createdTime: 1696500452908,
        readAt: null,
      }
    ]
    setLoading(true);
    setTimeout(()=>{
      setLoading(false);
      setNotifications(testData);
      setPageCount(Math.ceil(testData.length / pageSize));
    }, 2000);
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    if (!isFirstRender) getUsers();
  }, [page]);

  useEffect(() => {
    if (page === 1) getUsers();
    else setPage(1);
  }, [searchValue]);

  return !isLoading ? (
    <div>
      {notifications?.length > 0 ? (
        <>
          <Box
            sx={{ width: "100%" }}
            className="task-preview-container max-h-[calc(100vh-360px)] overflow-y-auto rounded-sm shadow-md "
          >
            <TableContainer>
              <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
                {/* <NotifcationTableHead status={1} /> */}
                <TableBody>
                  {notifications?.map((row: any, index: number) => {
                    return (
                      <NotificationTableRow
                        setNotifications={setNotifications}
                        index={index}
                        key={JSON.stringify(row)}
                        row={row}
                        page={page}
                        pageSize={pageSize}
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
        <div>Chưa có thông báo để hiển thị</div>
      )}
    </div>
  ) : (
    <CircularProgress size={25} />
  );
};

export default React.memo(NotificationTable);