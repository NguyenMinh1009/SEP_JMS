import React, { useEffect, useState } from "react";
import APIClientInstance from "../api/AxiosInstance";
import { Box, CircularProgress, Table, TableBody, TableContainer } from "@mui/material";
import { PriceGroup, PriceItem } from "../interface/price";
import PriceListTableHead from "../components/price/priceList/PriceListHead";
import PriceListPreviewRow from "../components/price/priceList/PriceListPreviewRow";
import { JobType, jobOptions } from "../enums/jobType";
import { recursiveStructuredClone } from "../utils/recursiveStructuredClone";
import { IoCreateOutline } from "react-icons/io5";
import useTitle from "../hooks/store/useCurrentTitle";
import { useNavigate, useParams } from "react-router-dom";
import { PathString } from "../enums/MapRouteToBreadCrumb";
import CustomButton from "../components/common/CustomButton";
import useSnakeBar from "../hooks/store/useSnakeBar";

interface ICompanyPreview {
  searchValue?: string;
}

interface ListResponse {
  group: PriceGroup;
  prices: PriceItem[];
}

const EditPriceGroup: React.FC<ICompanyPreview> = ({ searchValue }) => {
  const [priceGroupName, setPriceGroupName] = useState<string>("");
  const [priceGroupDescription, setPriceGroupDescription] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [jobTypes, setJobTypes] = useState<any[]>([]);
  const [priceList, setPriceList] = useState<Partial<PriceItem>[]>(
    jobOptions.map(item => ({
      jobTypeId: item.key,
      description: "",
      priceGroupName: "",
      unitPrice: 0
    }))
  );

  const { priceGroupId } = useParams();
  const navigate = useNavigate();
  const title = useTitle();
  const snakeBar = useSnakeBar();

  useEffect(() => {
    getPriceInfo();
    getJobTypes();
  }, []);

  const handleGoBack = () => {
    navigate(location.pathname.replace(`/${PathString.CHINH_SUA}`, ""));
  };

  const getJobTypes = async () => {
    setLoading(true);
    await APIClientInstance.get(`jobtype/all`)
      .then(res => {
        
        setJobTypes(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getPriceInfo = async () => {
    setLoading(true);
    await APIClientInstance.get(`price/group/${priceGroupId}`)
      .then(res => {
        const { group, prices = [] } = res.data as ListResponse;
        title.setContent(group.name);
        setPriceGroupName(group.name);
        setPriceGroupDescription(group.description);
        const priceList = prices.map(item => ({ ...item, priceGroupName: group.name }));
        setPriceList(priceList);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChangeDescription = (event: any, id: JobType) => {
    const cloneList = recursiveStructuredClone(priceList);
    const index = cloneList.findIndex(item => item.jobTypeId === id);
    if (index > -1) {
      cloneList[index].description = event.target.value;
    }
    setPriceList(cloneList);
  };

  const handleChangePrice = (event: any, id: JobType) => {
    const cloneList = recursiveStructuredClone(priceList);
    const index = cloneList.findIndex(item => item.jobTypeId === id);
    if (index > -1) {
      cloneList[index].unitPrice = event.target.value;
    }
    setPriceList(cloneList);
  };

  const handleEditPriceGroup = () => {
    if (!priceGroupName.trim()) {
      snakeBar.setSnakeBar("Tên nhóm giá là bắt buộc!", "warning", true);
      return;
    }
    setLoading(true);
    APIClientInstance.put(`price/group/${priceGroupId}`, {
      name: priceGroupName,
      description: priceGroupDescription,
      prices: priceList
    })
      .then(_res => {
        handleGoBack();
      })
      .catch(err => {
        console.error(err);
        snakeBar.setSnakeBar("Chỉnh sửa không thành công! [" + err.response.data + "]", "error", true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderPriceListTableBody = () => {
    if (priceList.length === 0) return <></>;
    return priceList.map((row: any, index: number) => {
      return (
        <PriceListPreviewRow
          edit
          handleChangeDescription={e => handleChangeDescription(e, row.jobTypeId)}
          handleChangePrice={e => handleChangePrice(e, row.jobTypeId)}
          jobTypes={jobTypes}
          index={index}
          key={row.jobTypeId}
          row={row}
          page={1}
          pageSize={1}
        />
      );
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div className="grid max-w-[600px] grid-cols-2 items-end gap-3">
          <div className="flex flex-col items-start gap-3">
            <label htmlFor="" className="text-primary col-span-2 mr-4">
              Tên nhóm giá
            </label>
            <input
              value={priceGroupName}
              onChange={e => setPriceGroupName(e.target.value)}
              type="text"
              className="common-input-border w-full rounded-md p-2 leading-5 shadow-sm"
            />
          </div>
          <div className="flex flex-col items-start gap-3">
            <label htmlFor="" className="text-primary col-span-2 mr-4">
              Mô tả
            </label>
            <input
              value={priceGroupDescription}
              onChange={e => setPriceGroupDescription(e.target.value)}
              type="text"
              className="common-input-border w-full rounded-md p-2 leading-5 shadow-sm"
            />
          </div>
        </div>
        <div className="flex flex-col items-center gap-3 md:flex-row">
          <CustomButton onClick={handleGoBack}>Quay lại</CustomButton>
          <div
            onClick={handleEditPriceGroup}
            className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md bg-accent p-3 text-white hover:opacity-75"
          >
            {isLoading ? (
              <CircularProgress size={20} className="text-white" />
            ) : (
              <IoCreateOutline size={20} className="text-white" />
            )}
            <span>Lưu thông tin</span>
          </div>
        </div>
      </div>
      <p className="text-primary mb-6 text-base">Danh sách đơn giá</p>
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
    </div>
  );
};

export default EditPriceGroup;
