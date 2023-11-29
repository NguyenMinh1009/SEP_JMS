import React, { useEffect, useState } from "react";
import APIClientInstance from "../api/AxiosInstance";
import { Box, CircularProgress, Input, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";

import PriceListPreviewRow from "../components/price/priceList/PriceListPreviewRow";
import { recursiveStructuredClone } from "../utils/recursiveStructuredClone";
import useSnakeBar from "../hooks/store/useSnakeBar";
import { useNavigate } from "react-router-dom";
import { PathString } from "../enums/MapRouteToBreadCrumb";
import { IoAddCircleOutline, IoCreateOutline } from "react-icons/io5";
import { cn } from "../utils/className";
import { AiFillEdit } from "react-icons/ai";
import { TiDelete } from "react-icons/ti";
import CustomDialog from "../components/common/CustomDialog";
import TypeOfJobRow from "../components/price/priceGroup/TypeOfJobRow";

interface ICompanyPreview {
  searchValue?: string;
}

const TypeObJobsTableHead = () => {
  return (
    <TableHead className="border-b-0">
      <TableRow
        className="bg-third"
        sx={{
          "& > *:not(:last-child)": {
            borderRight: "2px white solid"
          },
          "& > *": {
            borderBottom: 0
          }
        }}
      >

        <TableCell
          key={0}
          align="center"
          padding="none"
          className="px-1 py-3 align-top"
        >
          STT
        </TableCell>

        <TableCell
          key={1}
          align="center"
          padding="none"
          className="px-1 py-3 align-top"
        >
          Tên thiết kế
        </TableCell>

        <TableCell
          key={2}
          align="center"
          padding="none"
          className="px-1 py-3 align-top"
        >
          Actions
        </TableCell>

      </TableRow>
    </TableHead>
  );
};



const EditTypeOfJobs: React.FC<ICompanyPreview> = ({ searchValue }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [jobTypes, setJobTypes] = useState<any[]>([]);
  const [fixName, setFixName] = useState<string>("");
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const snakeBar = useSnakeBar();
  const navigate = useNavigate();

  useEffect(() => {
    getJobTypes();
  }, []);


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



  const handleChangeTypeName = (event: any, id: string) => {
    const cloneList = recursiveStructuredClone(jobTypes);
    const index = cloneList.findIndex(item => item.typeId === id);
    if (index > -1) {
      cloneList[index].typeName = event.target.value;
    }
    setJobTypes(cloneList);
    console.log(cloneList);
  };

  const updateFixName = (event: any) => {
    setFixName(event.target.value);
  }

  const submitNewName = async () => {
    await APIClientInstance.post(`jobtype`, null, {params: {name: fixName}})
    .then(() => {
      snakeBar.setSnakeBar("Lưu thiết kế thành công!", "success", true);
      setFixName("");
      setOpenConfirmDialog(false);
      getJobTypes();
    })
    .catch(err => {
      snakeBar.setSnakeBar("Có lỗi xảy ra khi lưu! [" + err.response.data + "]", "error", true);
    }).finally(()=>{
      
    });
  }

  const handleDeleteTypeOfJob = (id: string) => {
    setJobTypes((prev: any) => {
      let clone = recursiveStructuredClone(prev);
      clone = clone.filter((e: any) => e.typeId !== id);
      return clone;
    });
  }

  const handleCreatePriceGroup = () => { };

  const renderTableBody = () => {

    if (jobTypes.length === 0) return <></>;
    return jobTypes.map((row: any, index: number) => {
      return (
        <TypeOfJobRow
          index={index}
          row={row}
          key={JSON.stringify(row) + "_m"}
          removeRow={handleDeleteTypeOfJob}
        />
      );
    });
  };

  const renderInputElement = (): JSX.Element => {
    return (
      <TextField
            required
            id="standard-required"
            variant="standard"
            onChange={updateFixName}
          />
    );
  };

  return (
    <>
      <CustomDialog
        openDialog={openConfirmDialog}
        handleClose={()=>setOpenConfirmDialog(false)}
        title="Tạo thiết kế mới!"
        description="Nhập tên cho kiểu thiết kế mới (duy nhất):"
        primaryBtnText="Lưu lại"
        secondaryBtnText={"Quay trở lại"}
        primaryBtnCallback={submitNewName}
        secondaryBtnCallback={()=>setOpenConfirmDialog(false)}
        renderCustomChildren={renderInputElement}
        customSecondaryBtnClass="text-[#aaa] text-opacity-75 hover:text-opacity-100"
      />
      <div>
        <div className="mb-6 flex items-end justify-between">
          <div className="grid max-w-[600px] grid-cols-2 items-end gap-3">

            {/* <div className="flex flex-col items-start gap-3">
            <div
              onClick={(handleCreatePriceGroup)}
              className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md bg-accent p-3 text-white hover:opacity-75"
            >
              {isLoading ? (
                <CircularProgress size={20} className="text-white" />
              ) : (
                <IoAddCircleOutline size={20} className="text-white" />
              )}
              <span>Thêm thiết kế</span>
            </div>
          </div> */}

          </div>
          <div
            onClick={()=>setOpenConfirmDialog(true)}
            className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md bg-accent p-3 text-white hover:opacity-75"
          >
            {isLoading ? (
              <CircularProgress size={20} className="text-white" />
            ) : (
              <IoCreateOutline size={20} className="text-white" />
            )}
            <span>Thêm thiết kế</span>
          </div>
        </div>
        <p className="text-primary mb-6 text-base">Danh sách loại thiết kế</p>
        <Box
          sx={{ width: "100%" }}
          className="task-preview-container max-h-[calc(100vh-360px)] overflow-y-auto rounded-sm shadow-md "
        >
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
              <TypeObJobsTableHead />
              <TableBody>{renderTableBody()}</TableBody>
            </Table>
          </TableContainer>
        </Box>
      </div>
    </>

  );
};

export default EditTypeOfJobs;
