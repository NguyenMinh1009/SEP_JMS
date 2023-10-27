import React, { useEffect, useState } from "react";
import AlwayxInstance from "../../../api/AxiosInstance";
import { useIsFirstRender } from "../../../hooks/useIsFirstRender";
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
import TablePagination from "../../common/TablePagination";
import PriceGroupTableHead from "./PriceGroupHead";
import PriceGroupPreviewRow from "./PriceGroupPreviewRow";
import { PriceGroup } from "../../../interface/price";
import { recursiveStructuredClone } from "../../../utils/recursiveStructuredClone";

interface ICompanyPreview {
  searchValue: string;
}

const pageSize = 10;

const PriceGroupPreview: React.FC<ICompanyPreview> = ({ searchValue }) => {
  const [priceGroups, setPriceGroups] = useState<Partial<PriceGroup>[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [page, setPage] = React.useState(1);
  const [pageCount, setPageCount] = React.useState<number>(1);

  const isFirstRender = useIsFirstRender();

  const getPriceGroups = async () => {
    setLoading(true);
    await AlwayxInstance.post("price/all", {
      name: searchValue
    }).then(res => {
      setLoading(false);
      setPriceGroups(res.data.items);
      setPageCount(Math.ceil(res.data.count / pageSize));
    });
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const removePriceGroupPreview = (id: number) => {
    const priceClone = recursiveStructuredClone(priceGroups);
    const currentPriceIndex = priceClone.findIndex(price => price.priceGroupId === id);
    if (currentPriceIndex > -1) {
      priceClone.splice(currentPriceIndex, 1);
    }
    setPriceGroups(priceClone);
  };

  useEffect(() => {
    if (!isFirstRender) getPriceGroups();
  }, [page]);

  useEffect(() => {
    if (page === 1) getPriceGroups();
    else setPage(1);
  }, [searchValue]);

  return !isLoading ? (
    <div>
      {priceGroups?.length > 0 ? (
        <>
          <Box
            sx={{ width: "100%" }}
            className="task-preview-container max-h-[calc(100vh-360px)] overflow-y-auto rounded-sm shadow-md "
          >
            <TableContainer>
              <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
                <PriceGroupTableHead />
                <TableBody>
                  {priceGroups?.map((row, index) => {
                    return (
                      <PriceGroupPreviewRow
                        removePriceGroupPreview={removePriceGroupPreview}
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
        <div className="-ml-1">Chưa có nhóm giá để hiển thị</div>
      )}
    </div>
  ) : (
    <CircularProgress size={25} />
  );
};

export default PriceGroupPreview;
