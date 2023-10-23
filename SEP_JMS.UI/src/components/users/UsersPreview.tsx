import React, { useState, useEffect } from "react";
import APIClientInstance from "../../api/AxiosInstance";
import { CircularProgress } from "@mui/material";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "../common/TablePagination";
import { Role } from "../../enums/role";
import UsersTableHead from "./UsersTableHead";
import UsersPreviewRow from "./UsersPreviewRow";
import { useIsFirstRender } from "../../hooks/useIsFirstRender";

interface IUserPreview {
  role: Role;
  searchValue: string;
}

const pageSize = 10;

const TaskPreview: React.FC<IUserPreview> = ({ role, searchValue }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [pageCount, setPageCount] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(1);

  const isFirstRender = useIsFirstRender();

  const getUsers = async () => {
    setLoading(true);
    await APIClientInstance.post("admin/users/all", {
      pageIndex: page,
      pageSize: pageSize,
      searchText: searchValue,
      role: role
    }).then(res => {
      setLoading(false);
      setUsers(res.data.items);
      setPageCount(Math.ceil(res.data.count / pageSize));
    });
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
  }, [role, searchValue]);

  return !isLoading ? (
    <div>
      {users?.length > 0 ? (
        <>
          <Box
            sx={{ width: "100%" }}
            className="task-preview-container max-h-[calc(100vh-360px)] overflow-y-auto rounded-sm shadow-md "
          >
            <TableContainer>
              <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
                <UsersTableHead role={role} />
                <TableBody>
                  {users?.map((row: any, index: number) => {
                    return (
                      <UsersPreviewRow
                        setUsers={setUsers}
                        role={role}
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
        <div>Chưa có tài khoản để hiển thị</div>
      )}
    </div>
  ) : (
    <CircularProgress size={25} />
  );
};

export default React.memo(TaskPreview);
