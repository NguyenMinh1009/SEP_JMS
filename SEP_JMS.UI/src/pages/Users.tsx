import React, { KeyboardEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UsersPreview from "../components/users/UsersPreview";
import { MenuItem, Select, TextField } from "@mui/material";
import { createRoleOptions } from "../constants";
import { Role } from "../enums/Role";
import { IoAddCircleOutline } from "react-icons/io5";
import CustomDialog from "../components/common/CustomDialog";
import { CreateRole } from "../enums/createRole";
import { PathString } from "../enums/MapRouteToBreadCrumb";
import useCurrentSelectedRole from "../hooks/store/useCurrentSelectedRole";
import CompanyPreview from "../components/company/CompanyPreview";
import useTempSelectedRole from "../hooks/store/useCurrentTempRole";

interface IUsersManageProps {}
const UsersPage: React.FC<IUsersManageProps> = () => {
  const navigate = useNavigate();
  const { selectedRole: selectedCreateRole, setRole } = useCurrentSelectedRole();
  const { selectedRole, setRole: setTempRole } = useTempSelectedRole();
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const [value, setValue] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  const handleClose = () => {
    setOpenConfirmDialog(false);
  };

  const onSearch = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.code == "Enter") {
      setSearchValue(value);
    }
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

  const handleNavigate = () => {
    switch (selectedCreateRole) {
      case CreateRole.COMPANY:
        navigate(`/${PathString.USERS}/${PathString.CREATE_COMPANY}`);
        break;
      case CreateRole.CUSTOMER:
        navigate(`/${PathString.USERS}/${PathString.CREATE_CUSTOMER}`);
        break;
      default:
        navigate(`/${PathString.USERS}/${PathString.CREATE_EMPLOYEE}`);
        break;
    }
  };

  const renderPreviewSection = () => {
    return selectedRole !== CreateRole.COMPANY ? (
      <UsersPreview role={selectedRole as unknown as Role} searchValue={searchValue} />
    ) : (
      <CompanyPreview searchValue={searchValue} />
    );
  };

  return (
    <>
      <CustomDialog
        openDialog={openConfirmDialog}
        handleClose={handleClose}
        title="Tạo tài khoản/công ty mới!"
        description="Lựa chọn loại tài khoản/công ty để tạo:"
        primaryBtnText={getCreateAccountDialogText()}
        secondaryBtnText={"Quay trở lại"}
        primaryBtnCallback={handleNavigate}
        secondaryBtnCallback={handleClose}
        renderCustomChildren={renderDialogDropdownSelection}
        customSecondaryBtnClass="text-[#aaa] text-opacity-75 hover:text-opacity-100"
      />
      <div className="mb-10 flex items-center justify-between">
        <div className="gp-4 grid flex-1 grid-cols-3 xl:grid-cols-4">
          <div className="flex items-start gap-3">
            <Select
              fullWidth
              size="small"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedRole}
              onChange={e => setTempRole(e.target.value as CreateRole)}
              sx={{
                maxWidth: "180px",
                "& .MuiInputBase-inputSizeSmall": {
                  fontSize: "13px !important"
                }
              }}
            >
              {createRoleOptions.map(({ key, text }) => (
                <MenuItem key={key} value={key}>
                  {text}
                </MenuItem>
              ))}
            </Select>
            <TextField
              placeholder="Tìm tài khoản..."
              size="small"
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyDown={onSearch}
              sx={{
                width: "250px",
                height: "40px",
                "& .MuiInputBase-inputSizeSmall": {
                  fontSize: "13px !important"
                }
              }}
            />
          </div>
        </div>
        <div
          onClick={() => {
            setOpenConfirmDialog(true);
          }}
          className="flex cursor-pointer items-center gap-2 rounded-md bg-accent p-3 text-white hover:opacity-75"
        >
          <IoAddCircleOutline size={20} className="text-white" />
          <span>Tạo tài khoản mới</span>
        </div>
      </div>
      <p className="text-primary mb-6 text-base">
        {selectedRole === CreateRole.COMPANY ? "Danh sách công ty" : "Danh sách người dùng"}
      </p>
      <div className="grid grid-cols-20 items-start gap-2">
        <div className="col-span-full overflow-hidden p-1 pb-20 ">{renderPreviewSection()}</div>
      </div>
    </>
  );
};

export default UsersPage;
