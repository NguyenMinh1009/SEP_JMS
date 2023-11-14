import React, { useEffect, useState } from "react";
import APIClientInstance from "../api/AxiosInstance";
import { Box, CircularProgress, Table, TableBody, TableContainer } from "@mui/material";
import { PriceItem } from "../interface/price";
import PriceListTableHead from "../components/price/priceList/PriceListHead";
import PriceListPreviewRow from "../components/price/priceList/PriceListPreviewRow";
import { JobType, jobOptions } from "../enums/jobType";
import { recursiveStructuredClone } from "../utils/recursiveStructuredClone";
import useSnakeBar from "../hooks/store/useSnakeBar";
import { useNavigate } from "react-router-dom";
import { PathString } from "../enums/MapRouteToBreadCrumb";
import { IoCreateOutline } from "react-icons/io5";
import moment from "moment";

interface ICompanyPreview {
  searchValue?: string;
}

const CreatePriceGroups: React.FC<ICompanyPreview> = ({ searchValue }) => {
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

  const snakeBar = useSnakeBar();
  const navigate = useNavigate();

  useEffect(() => {
    getJobTypes();
  }, []);

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

  const handleCreatePriceGroup = () => {
    if (!priceGroupName.trim()) {
      snakeBar.setSnakeBar("Tên nhóm giá là bắt buộc!", "warning", true);
      return;
    }
    setLoading(true);
    APIClientInstance.post("price/group", {
      name: priceGroupName,
      description: priceGroupDescription,
      prices: priceList
    })
      .then(_res => {
        navigate(`/${PathString.PRICES}`);
      })
      .catch(err => {
        snakeBar.setSnakeBar("Tạo không thành công!", "error", true);
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGetTemplate = () => {
    APIClientInstance.post(
      "price/export_template",
      null,
      { responseType: "blob" }
    )
      .then(response => {
        const docFile = new File(
          [response.data],
          "Template_Price_" + moment(new Date()).format("DD-MM-YYYY - hhhmm"),
          {
            type: response.data.type
          }
        );
        const fileLink = document.createElement("a");
        fileLink.href = URL.createObjectURL(docFile);
        fileLink.setAttribute(
          "download",
          "Template_Price_" + moment(new Date()).format("DD-MM-YYYY - hgmm")
        );
        fileLink.click();
      })
      .finally(() => {
        // setIsExporting(false);
      });
  };

  const getJobTypes = async () => {
    setLoading(true);
    await APIClientInstance.get(`jobtype/all`)
      .then(res => {
        setJobTypes(res.data);
        let jt: any[] = res.data;

        setPriceList(
          jt.map(item => ({
            jobTypeId: item.typeId,
            description: "",
            priceGroupName: "",
            unitPrice: 0
          })));

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
        <div className="flex items-start gap-3">
          <div
            onClick={handleGetTemplate}
            className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md bg-accent p-3 text-white hover:opacity-75"
          >
            <span>Nhập từ file</span>
          </div>
          <div
            onClick={handleCreatePriceGroup}
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

export default CreatePriceGroups;
