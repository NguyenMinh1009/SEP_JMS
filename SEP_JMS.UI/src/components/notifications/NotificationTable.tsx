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
import { NotificationStatus } from "../../enums/NotificationStatus";
interface INotifyPreview {
  status: NotificationStatus;
  searchValue: string;
}

const pageSize = 10;

const NotificationTable: React.FC<INotifyPreview> = ({ status, searchValue }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [pageCount, setPageCount] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(1);

  const isFirstRender = useIsFirstRender();

  const getNotifications = async () => {
    setLoading(true);
    await AlwayxInstance.post("notification", {
      pageIndex: page,
      pageSize: pageSize,
      status: NotificationStatus[status].toLocaleLowerCase()
    }).then(res => {
      setLoading(false);
      setNotifications(res.data.item2.items);
      setPageCount(Math.ceil(res.data.item2.count / pageSize));
    });
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    if (!isFirstRender) getNotifications();
  }, [page]);

  useEffect(() => {
    if (page === 1) getNotifications();
    else setPage(1);
  }, [status, searchValue]);

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
