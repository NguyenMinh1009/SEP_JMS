import React, { KeyboardEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MenuItem, Select, TextField } from "@mui/material";
import { createRoleOptions } from "../constants";
import { IoAddCircleOutline, IoCreateOutline } from "react-icons/io5";
import CustomDialog from "../components/common/CustomDialog";
import { CreateRole } from "../enums/createRole";
import { PathString } from "../enums/MapRouteToBreadCrumb";
import useCurrentSelectedRole from "../hooks/store/useCurrentSelectedRole";
import PriceGroupPreview from "../components/price/priceGroup/PriceGroupPreview";

interface IFinishedTasks { }
const PricesPage: React.FC<IFinishedTasks> = () => {
  const navigate = useNavigate();
  const { selectedRole: selectedCreateRole, setRole } = useCurrentSelectedRole();
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const [value, setValue] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  const handleClose = () => {
    setOpenConfirmDialog(false);
  };

  const getCreateAccountDialogText = (): string => {
    const currentRoleText = createRoleOptions.find(
      option => option.key === selectedCreateRole
    )?.text;
    return `Tạo ${currentRoleText}`;
  };

  const renderDialogDropdownSelection = (): JSX.Element => {
    return (
      <Select
        fullWidth
        size="small"
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={selectedCreateRole}
        onChange={e => setRole(e.target.value as CreateRole)}
        sx={{
          "& .MuiInputBase-inputSizeSmall": {
            fontSize: "13px !important"
          },
          marginTop: "10px",
          width: "340px",
          maxWidth: "100%"
        }}
      >
        {createRoleOptions.map(({ key, text }) => (
          <MenuItem key={key} value={key}>
            {text}
          </MenuItem>
        ))}
      </Select>
    );
  };

  const onSearch = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.code == "Enter") {
      setSearchValue(value)
    }
  };

  

  return (
    <>
      
      <div className="mb-10 flex items-center justify-between">
        <div className="gp-4 grid flex-1 grid-cols-3 xl:grid-cols-4">
          <div className="flex flex-col gap-3">
            <TextField
              placeholder="Tìm nhóm giá..."
              size="small"
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyDown={onSearch}
              sx={{
                height: "40px",
                maxWidth: "180px",
                "& .MuiInputBase-inputSizeSmall": {
                  fontSize: "13px !important"
                }
              }}
            />
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div
            onClick={() => {
              navigate(`/${PathString.PRICES}/${PathString.TYPEOFJOBS}`)
            }}
            className="flex cursor-pointer items-center gap-2 rounded-md bg-accent p-3 text-white hover:opacity-75 "
          >
            <IoCreateOutline size={20} className="text-white" />
            <span>Chỉnh sửa loại thiết kế</span>
          </div>
          <div
            onClick={() => {
              navigate(`/${PathString.PRICES}/${PathString.THEM_MOI}`)
            }}
            className="flex cursor-pointer items-center gap-2 rounded-md bg-accent p-3 text-white hover:opacity-75"
          >
            <IoAddCircleOutline size={20} className="text-white" />
            <span>Tạo nhóm giá mới</span>
          </div>
        </div>
      </div>
      <p className="text-primary mb-6 text-base">Danh sách nhóm giá</p>
      <div className="grid grid-cols-20 items-start gap-2">
        <div className="col-span-full overflow-hidden p-1 pb-20 ">
          <PriceGroupPreview searchValue={searchValue} />
        </div>
      </div>
    </>
  );
};

export default PricesPage;
