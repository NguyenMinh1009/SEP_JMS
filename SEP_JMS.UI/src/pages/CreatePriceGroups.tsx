import React, { useEffect, useState } from "react";
import { styled, alpha } from '@mui/material/styles';
import APIClientInstance from "../api/AxiosInstance";
import { Box, CircularProgress, Menu, MenuItem, MenuProps, Table, TableBody, TableContainer } from "@mui/material";
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
import { FaFileImport } from "react-icons/fa";

interface ICompanyPreview {
  searchValue?: string;
}

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

const CreatePriceGroups: React.FC<ICompanyPreview> = ({ searchValue }) => {
  const [priceGroupName, setPriceGroupName] = useState<string>("");
  const [priceGroupDescription, setPriceGroupDescription] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isProcessing, setProcessing] = useState<boolean>(false);
  const [jobTypes, setJobTypes] = useState<any[]>([]);
  const [priceList, setPriceList] = useState<Partial<PriceItem>[]>(
    jobOptions.map(item => ({
      jobTypeId: item.key,
      description: "",
      priceGroupName: "",
      unitPrice: 0
    }))
  );

  // custom drop menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };


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
    handleMenuClose();
    setProcessing(true);
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
        setProcessing(false);
      });
  };

  const handleImportTemplate = () => {
    handleMenuClose();
    setProcessing(true);
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    input.click();
    input.onchange = (e: any) => {
      console.log(input.files);
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      APIClientInstance.post("price/import_template_file", formData)
        .then(response => {
          const data = response.data;
          console.log(data);
          setPriceGroupName(data.group.name);
          setPriceGroupDescription(data.group.description);

          // price list
          const cloneList = recursiveStructuredClone(priceList);
          for (const pr of data.prices) {
            const index = cloneList.findIndex(item => item.jobTypeId === pr.jobTypeId);
            if (index > -1) {
              cloneList[index].unitPrice = pr.unitPrice;
              cloneList[index].description = pr.description;
            }
          }
          setPriceList(cloneList);
          console.log(cloneList);

        })
        .catch(err => {
          console.log(err);
          snakeBar.setSnakeBar("Có lỗi xảy ra khi import", "error", true);
        })
        .finally(() => setProcessing(false));
    };
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
          <StyledMenu
            id="demo-customized-menu"
            MenuListProps={{
              'aria-labelledby': 'demo-customized-button',
            }}
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleImportTemplate} disableRipple>
              Nhập từ file trên máy
            </MenuItem>
            <MenuItem onClick={handleGetTemplate} disableRipple>
              
              Tải về Template
            </MenuItem>
          
          </StyledMenu>
          <div
            onClick={handleMenuClick}
            className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md bg-accent p-3 text-white hover:opacity-75"
          >
            {isProcessing ? (
              <CircularProgress size={20} className="text-white" />
            ) : (
              <FaFileImport size={20} className="text-white" />
            )}
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
