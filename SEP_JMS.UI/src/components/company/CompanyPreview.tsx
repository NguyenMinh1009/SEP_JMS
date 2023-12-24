import React, { useEffect, useState } from "react";
import AlwayxInstance from "../../api/AxiosInstance";
import { Box, CircularProgress, Table, TableBody, TableContainer } from "@mui/material";
import TablePagination from "../common/TablePagination";
import CompanyTableHead from "./CompanyTableHead";
import CompanyPreviewRow from "./CompanyPreviewRow";
import { CompanyResponseType } from "../../interface/company";
import { useIsFirstRender } from "../../hooks/useIsFirstRender";

interface ICompanyPreview {
  searchValue: string;
}

const pageSize = 10;

const CompanyPreview: React.FC<ICompanyPreview> = ({ searchValue }) => {
  const [companies, setCompanies] = useState<CompanyResponseType[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [page, setPage] = React.useState(1);
  const [pageCount, setPageCount] = React.useState<number>(0);
  const [refresh, setRefresh] = React.useState<number>(0);

  const isFirstRender = useIsFirstRender();

  const getCompanies = async () => {
    setLoading(true);
    await AlwayxInstance.post("admin/company/all", {
      pageIndex: page,
      pageSize: pageSize,
      searchText: searchValue
    }).then(res => {
      setLoading(false);
      setCompanies(res.data.items);
      setPageCount(Math.ceil(res.data.count / pageSize));
    });
  };

  useEffect(()=>{getCompanies()}, [refresh]);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    if (!isFirstRender) getCompanies();
  }, [page]);

  useEffect(() => {
    if (page === 1) getCompanies();
    else setPage(1);
  }, [searchValue]);

  return !isLoading ? (
    <div>
      {companies?.length > 0 ? (
        <>
          <Box
            sx={{ width: "100%" }}
            className="task-preview-container max-h-[calc(100vh-360px)] overflow-y-auto rounded-sm shadow-md "
          >
            <TableContainer className="overflow-x-visible">
              <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
                <CompanyTableHead />
                <TableBody>
                  {companies?.map((row: any, index: number) => {
                    return (
                      <CompanyPreviewRow
                        index={index}
                        key={JSON.stringify(row)}
                        row={row}
                        page={page}
                        pageSize={pageSize}
                        setRefresh={setRefresh}
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
        <div>Chưa có company để hiển thị</div>
      )}
    </div>
  ) : (
    <CircularProgress size={25} />
  );
};

export default CompanyPreview;
