import React, { useEffect, useState } from "react";
import AlwayxInstance from "../../api/AxiosInstance";
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableRow
} from "@mui/material";
import useFilterInfo from "../../hooks/store/useFilterInfo";
import ReportHead from "./ReportHead";
import { ReportItem } from "../../interface/report";
import ReportPreviewRow from "./ReportPreviewRow";

interface IReportPreview {}

const pageSize = 10;

const ReportPreview: React.FC<IReportPreview> = () => {
  const [reportItems, setReportItems] = useState<Partial<ReportItem>[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const filterInfoController = useFilterInfo();

  const getReportInfo = () => {
    setLoading(true);
    AlwayxInstance.post("job/statistics", {
      ...filterInfoController.content
    })
      .then(res => {
        setReportItems(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => {
        setLoading(false);
      });
  };

  const totalJobCount = reportItems
    .map(item => item.totalJobs)
    .reduce((a, b) => (a ?? 0) + (b ?? 0), 0);

  const totalExpectedProfitCount = reportItems
    .map(item => item.expectedProfit)
    .reduce((a, b) => (a ?? 0) + (b ?? 0), 0);

  const totalFinishedJobCount = reportItems
    .map(item => item.totalFinishedJobs)
    .reduce((a, b) => (a ?? 0) + (b ?? 0), 0);

  const totalProfitCount = reportItems
    .map(item => item.totalProfit)
    .reduce((a, b) => (a ?? 0) + (b ?? 0), 0);

  useEffect(() => {
    getReportInfo();
  }, [filterInfoController.content]);

  return !isLoading ? (
    <div>
      {reportItems?.length > 0 ? (
        <>
          <Box
            sx={{ width: "100%" }}
            className="task-preview-container max-h-[calc(100vh-360px)] overflow-y-auto rounded-sm shadow-md "
          >
            <TableContainer>
              <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
                <ReportHead />
                <TableBody>
                  {reportItems?.map((row, index) => {
                    return <ReportPreviewRow index={index} key={JSON.stringify(row)} row={row} />;
                  })}
                </TableBody>
                <TableFooter className="border-2">
                  <TableRow className="bg-gray-200">
                    <TableCell></TableCell>
                    <TableCell className="text-center font-extrabold">
                      Tổng ({reportItems.length ?? 0})
                    </TableCell>
                    <TableCell className="text-center font-extrabold">{totalJobCount}</TableCell>
                    <TableCell className="text-center font-extrabold">
                      {totalExpectedProfitCount?.toLocaleString("vi-VN")}
                    </TableCell>
                    <TableCell className="text-center font-extrabold">
                      {totalFinishedJobCount}
                    </TableCell>
                    <TableCell className="text-center font-extrabold">
                      {totalProfitCount?.toLocaleString("vi-VN")}
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-0 bg-gray-50">
                    <TableCell></TableCell>
                    <TableCell className="text-center font-extrabold">Doanh thu TB</TableCell>
                    <TableCell className="text-center font-extrabold"></TableCell>
                    <TableCell className="text-center font-extrabold">
                      {parseFloat(((totalExpectedProfitCount ?? 0) / (reportItems.length || 0)).toFixed(0))?.toLocaleString('vi-VN')}
                    </TableCell>
                    <TableCell className="text-center font-extrabold"></TableCell>
                    <TableCell className="text-center font-extrabold">
                      {parseFloat(((totalProfitCount ?? 0) / (reportItems.length || 0)).toFixed(0))?.toLocaleString('vi-VN')}
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-0 bg-slate-50">
                    <TableCell></TableCell>
                    <TableCell className="text-center font-extrabold">Đơn giá TB</TableCell>
                    <TableCell className="text-center font-extrabold"></TableCell>
                    <TableCell className="text-center font-extrabold">
                      {parseFloat(((totalExpectedProfitCount ?? 0) / (totalJobCount || 1)).toFixed(0))?.toLocaleString('vi-VN')}
                    </TableCell>
                    <TableCell className="text-center font-extrabold"></TableCell>
                    <TableCell className="text-center font-extrabold">
                      {parseFloat(((totalProfitCount ?? 0) / (totalJobCount || 1)).toFixed(0))?.toLocaleString('vi-VN')}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Box>
        </>
      ) : (
        <div className="-ml-1">Chưa có thống kê để hiển thị</div>
      )}
    </div>
  ) : (
    <CircularProgress size={25} />
  );
};

export default ReportPreview;
