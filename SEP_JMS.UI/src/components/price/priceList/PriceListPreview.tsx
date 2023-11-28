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
  searchValue: string;
}

interface ListResponse {
  group: PriceGroup;
  prices: PriceItem[];
}

const PriceListPreview: React.FC<IPriceListPreview> = ({ searchValue }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [priceList, setPriceList] = useState<PriceItem[]>([]);
  const [jobTypes, setJobTypes] = useState<any[]>([]);

  const { priceGroupId } = useParams();

  const title = useTitle();

  const getPriceLists = async (jobTypeData: any) => {
    setLoading(true);
    await APIClientInstance.get(`price/group/${priceGroupId}`)
      .then(res => {
        const { group, prices = [] } = res.data as ListResponse;
        title.setContent(group.name);
        const priceList = prices.map(item => ({ ...item, priceGroupName: group.name }));
        var results: any[] = jobTypeData.map(function (it: any) {
          for (var i = 0; i < priceList.length; ++i) {
            if (it.typeId == priceList[i].jobTypeId) return priceList[i];
          }
        });
        setPriceList(results.filter(e=>e) as PriceItem[]);
        
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getJobTypes = async () => {
    setLoading(true);
    const res = await APIClientInstance.get(`jobtype/all`)
    setJobTypes(res.data);
    setLoading(false);
    return res.data;
  };

  const renderPriceListTableBody = () => {
    if (priceList.length === 0) return <></>;
    const getJobIdFromSearchText = jobOptions.find(item =>
      item.text.toLowerCase().includes(searchValue.trim().toLocaleLowerCase())
    )?.key;
    return (
      searchValue.trim() === ""
        ? priceList
        : priceList.filter(item => item.jobTypeId === getJobIdFromSearchText)
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

  useEffect(() => {
    async function loadData() {
      const jobTypesData = await getJobTypes();
      await getPriceLists(jobTypesData);
    }
    loadData();
  }, []);

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

export default PriceListPreview;
