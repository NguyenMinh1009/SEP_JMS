import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import APIClientInstance from "../../../api/AxiosInstance";
import { Box, CircularProgress, Table, TableBody, TableContainer } from "@mui/material";
import TablePagination from "../../common/TablePagination";
import PriceListTableHead from "./PriceListHead";
import PriceListPreviewRow from "./PriceListPreviewRow";
import { PriceGroup, PriceItem } from "../../../interface/price";
import useTitle from "../../../hooks/store/useCurrentTitle";
import { jobOptions } from "../../../enums/jobType";

interface IPriceListPreview {
  prices?: any;
  searchValue: string;
}

const PriceListPreviewAccount: React.FC<IPriceListPreview> = ({ searchValue, prices }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [priceList, setPriceList] = useState<PriceItem[]>([]);
  const [jobTypes, setJobTypes] = useState<any[]>([]);

  const getPriceLists = async (jobTypeData: any) => {
    if (prices === null) return;

    const groupName = "Mặc định";
    const priceList = prices?.map((item: any) => ({ ...item, priceGroupName: groupName }));
    if (priceList) {
      var results: any[] = jobTypeData.map(function (it: any) {
        for (var i = 0; i < priceList.length; ++i) {
          if (it.typeId == priceList[i].jobTypeId) return priceList[i];
        }
      });
      setPriceList(results.filter(e => e) as PriceItem[]);

    }
  };

  const getJobTypes = async () => {

    const res = await APIClientInstance.get(`jobtype/all`)
    setJobTypes(res.data);

    return res.data;
  };

  const renderPriceListTableBody = () => {
    if (priceList.length === 0) return <></>;
    const getJobIdsFromSearchText = jobTypes.filter(item =>
      item.typeName.toLowerCase().includes(searchValue.trim().toLocaleLowerCase())
    ).map(e => e.typeId);
    return (
      searchValue.trim() === ""
        ? priceList
        : priceList.filter(item => getJobIdsFromSearchText.includes(item.jobTypeId) || item.description?.toLowerCase().includes(searchValue.trim().toLocaleLowerCase()))
    ).map((row: any, index: number) => {
      return (
        <PriceListPreviewRow
          jobTypes={jobTypes}
          index={index}
          key={JSON.stringify(row)}
          row={row}
          page={1}
          pageSize={1}
        />
      );
    });
  };

  useEffect(()=>{
    async function loadData() {
      const jobTypesData = await getJobTypes();
      await getPriceLists(jobTypesData);
    }
    loadData();
  }, [prices]);

  return !isLoading ? (
    <div>
      {priceList?.length > 0 ? (
        <>
          <Box
            sx={{ width: "100%" }}
            className="task-preview-container max-h-[calc(100vh-360px)] overflow-y-auto rounded-sm shadow-md "
          >
            <TableContainer>
              <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
                <PriceListTableHead />
                <TableBody>{renderPriceListTableBody()}</TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      ) : (
        <div className="-ml-1">Chưa có nhóm giá để hiển thị</div>
      )}
    </div>
  ) : (
    <CircularProgress size={25} />
  );
};

export default PriceListPreviewAccount;
