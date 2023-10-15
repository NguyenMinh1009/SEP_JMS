import { Role } from "../enums/role";
import useCurrentPerson from "../hooks/store/useCurrentPerson";
import { AiFillStar, AiFillEye, AiFillEdit } from "react-icons/ai";
import { MdTextsms, MdPhotoCamera } from "react-icons/md";
import { BsCheck } from "react-icons/bs";
import { FaUser, FaLock } from "react-icons/fa";
import TaskPreview from "../components/TaskPreview";
import { useEffect, useState } from "react";
import moment from "moment";
import { ticksToDate } from "../utils/Datetime";
import Images from "../img";
import RequireText from "../components/common/RequireText";
import { Accordion, AccordionDetails, AccordionSummary, CircularProgress, FormControlLabel, FormGroup, Switch, Tooltip, Typography, styled } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { HiOutlineEye } from "react-icons/hi";
import { cn } from "../utils/className";
import { commonRegex } from "../constants";
import CustomButton from "../components/common/CustomButton";
import useSnakeBar from "../hooks/store/useSnakeBar";
import APIClientInstance from "../api/AxiosInstance";import { recursiveStructuredClone } from "../utils/recursiveStructuredClone";
import { info } from "console";
 "../api/AxiosInstance";

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&:before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&:after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));

const Profile = () => {
  const [selectedTab, setSelectedTab] = useState<string>("Thông tin");
  const [oldPassword, setOldPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rePassword, setRePassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [focusPassword, setFocusPassword] = useState<boolean>(false);
  const [focusRePassword, setFocusRePassword] = useState<boolean>(false);
  const [openPassTooltip, setOpenPassTooltip] = useState<boolean>(false);
  const [openRePassTooltip, setOpenRePassTooltip] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessUpdate, setIsProcessUpdate] = useState<boolean>(false);

  const currentPerson = useCurrentPerson();
  const snakeBar = useSnakeBar();

  // state for update information
  const [infoUpdate, setInfoUpdate] = useState<any>({});
  const onChangeBindInfo = (value: any, path: string) => {
    console.log("Current info:", infoUpdate);
    let clone = {... infoUpdate};
    clone[path] = value;
    setInfoUpdate(clone);
  }

  useEffect(() => {
    selectedTab === "Cập nhật thông tin" && setInfoUpdate({
      avatarUrl: currentPerson.avatarUrl,
      fullname: currentPerson.fullname,
      phone: currentPerson.phone,
      dob: currentPerson.dob,
      gender: currentPerson.gender,
      address: currentPerson.address
    })
  }, [selectedTab]);

  // Add more notification configurations
  const [notiState, setNotiState] = useState<boolean[]>([]);
  const [isProcessNotifyConfig, setIsProcessNotifyConfig] = useState<boolean>(false);

  const updateNotifyConfig = async () => {
    setIsProcessNotifyConfig(true);
    let arrs: number[] = [];
    notiState.map((v, i) => v && arrs.push(i));
    await APIClientInstance.post("notification/configure", arrs).then(res => {
      setIsProcessNotifyConfig(false);
      const currentData = JSON.parse(localStorage.getItem("user") ?? "");
      currentData.notificationConfig = JSON.stringify(arrs);
      currentPerson.setCurrentPerson?.(currentData);
      localStorage.setItem("user", JSON.stringify(currentData));
      window.dispatchEvent(new Event("storage"));
    });
  };

  const notiItems = [
    {
      title: "Công việc",
      value: 0
    },
    {
      title: "Bình luân",
      value: 1
    },
    {
      title: "Email",
      value: 2
    }
  ];

  useEffect(() => {
    if (focusPassword && !commonRegex.password.test(password)) setOpenPassTooltip(true);
    else setOpenPassTooltip(false);
  }, [focusPassword, password]);

  useEffect(() => {
    console.log(notiState);
    if (notiState.length === 0) {
      console.log("Update noti state:", notiState);
      setIsProcessNotifyConfig(true);
      let currentCfg = currentPerson.notificationConfig.replace("[", "").replace("]", "").split(",");
      let clone : boolean[] = [];
      currentCfg.map(value => clone[parseInt(value)] = true);
      setIsProcessNotifyConfig(false);
      setNotiState(clone);
    } else {
      updateNotifyConfig();
    }
    
  }, [notiState]);

  useEffect(() => {
    if (focusRePassword && password !== rePassword) setOpenRePassTooltip(true);
    else setOpenRePassTooltip(false);
  }, [focusRePassword, rePassword, password]);

  const getRoleText = (role?: Role) => {
    switch (role) {
      case Role.ACCOUNT:
        return "Account";
      case Role.CUSTOMER:
        return "Khách hàng";
      case Role.ADMIN:
        return "Admin";
      case Role.DESIGNER:
        return "Thiết kế";
    }
  };

  const tabs = [
    
    {
      text: "Thông tin",
      icon: <FaUser size={14} />
      //element: <TaskPreview />
    },
    {
      text: "Đổi mật khẩu",
      icon: <FaLock size={14} />
      //element: <TaskPreview />
    },
    {
      text: "Cập nhật thông tin",
      icon: <AiFillEdit size={14} />
      //element: <TaskPreview />
    },
    {
        text: "Thông báo",
        icon: <AiFillEye size={14} />,
        // element: <TaskPreview />
      }
  ];

  const onNotiSwitchChange = (e: React.ChangeEvent) => {
    let control = e.target as HTMLInputElement;
    const clone = recursiveStructuredClone(notiState);
    clone[parseInt(control.value)] = control.checked;
    setNotiState(clone);
  }

  const handleChangePassword = () => {
    if (!oldPassword.trim()) {
      snakeBar.setSnakeBar("Hãy điền đủ các trường!", "warning", true);
      return;
    }
    setIsLoading(true);
    APIClientInstance.post("user/ChangePassword", {
      oldPassword: oldPassword.trim(),
      newPassword: password.trim(),
      userName: currentPerson.username
    })
      .then(() => {
        snakeBar.setSnakeBar("Đổi mật khẩu thành công!", "success", true);
      })
      .catch(() => {
        snakeBar.setSnakeBar("Có lỗi xảy ra!", "error", true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleUpdateInfo = () => {
    if (!infoUpdate.fullname.trim()) {
      snakeBar.setSnakeBar("Hãy điền đủ các trường!", "warning", true);
      return;
    }
    setIsProcessUpdate(true);
    APIClientInstance.post("user/UpdateProfile", infoUpdate)
      .then(() => {
        const currentData = JSON.parse(localStorage.getItem("user") ?? "");
        for (const prop in infoUpdate) currentData[prop] = infoUpdate[prop];
        currentPerson.setCurrentPerson?.(currentData);
        localStorage.setItem("user", JSON.stringify(currentData));
        window.dispatchEvent(new Event("storage"));
        snakeBar.setSnakeBar("Cập nhật thông tin thành công!", "success", true);
      })
      .catch(() => {
        snakeBar.setSnakeBar("Có lỗi xảy ra!", "error", true);
      })
      .finally(() => {
        setIsProcessUpdate(false);
      });
  };

  return (
    <div className="flex h-full gap-12">
      <div className="flex w-1/4 max-w-[300px] flex-col items-start">
        <div className="group relative mb-9 aspect-square w-full cursor-pointer overflow-hidden rounded-md bg-slate-500">
          <img
            src={currentPerson.avatarUrl ?? Images.avtPlaceHolder}
            alt=""
            className="w-full object-cover"
          />
          <div className="absolute left-0 top-full flex h-2/5 w-full flex-col items-center justify-center gap-2 bg-black bg-opacity-30 transition-all group-hover:top-[60%]">
            <MdPhotoCamera size={26} className="text-white" />
            <p className="font-semibold text-white">Thay ảnh đại diện</p>
          </div>
        </div>
        <div className="w-full">
          <div className="mb-4">
            <div className="mb-2 flex gap-1">
              <p className="text-sm text-[#999]">Ngày tạo</p>
              <div className="mb-[2px] flex-1 border-b-2" />
            </div>
            <p className="font-semibold text-accent">
              {moment(ticksToDate(currentPerson.createdTime)).format("DD-MM-YYYY") || "..."}
            </p>
          </div>
          {currentPerson.roleType !== Role.CUSTOMER && (
            <>
              <div className="mb-4">
                <div className="mb-2 flex gap-1">
                  <p className="text-sm text-[#999]">Ngày tham gia</p>
                  <div className="mb-[2px] flex-1 border-b-2" />
                </div>
                <p className="font-semibold text-accent">
                  {moment(ticksToDate(currentPerson.onboardTime)).format("DD-MM-YYYY") || "..."}
                </p>
              </div>
              <div className="">
                <div className="mb-2 flex gap-1">
                  <p className="text-sm text-[#999]">Ngày nghỉ</p>
                  <div className="mb-[2px] flex-1 border-b-2" />
                </div>
                <p className="font-semibold text-accent">
                  {currentPerson.offboardTime
                    ? moment(ticksToDate(currentPerson.offboardTime)).format("DD-MM-YYYY")
                    : "Chưa có thông tin"}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="vertical-grid-container col-span-15">
        <div>
          <p className="text-primary text-2xl font-bold">{currentPerson.fullname}</p>
          <p className="text-secondary mb-4 font-semibold text-accent">
            {getRoleText(currentPerson.roleType)}
          </p>
          <div className="flex w-fit items-end gap-6 border-b-2">
            {tabs.map(tab => (
              <div
                onClick={() => setSelectedTab(tab.text)}
                className={`-mb-[2px] flex cursor-pointer items-center gap-2 pb-2 hover:opacity-80 ${
                  selectedTab === tab.text
                    ? "border-b-[3px] border-accent text-[#222]"
                    : "text-[#999]"
                }`}
                key={tab.text}
              >
                {tab.icon}
                <p className="font-semibold">{tab.text}</p>
              </div>
            ))}
          </div>
        </div>
        {selectedTab === "Thông báo" && (
          <div>
            {/* <p className="mt-6 opacity-60">Cài đặt nhận thông báo</p> */}
            <div>
              <div className="flex flex-col gap-4 pt-6">
                <FormGroup>
                  {notiItems.map(v => (
                    <FormControlLabel
                      style={{marginLeft: "0px"}}
                      value = {v.value}
                      control={<Android12Switch checked={notiState[v.value]} disabled={isProcessNotifyConfig} onChange={onNotiSwitchChange} />}
                      label={"Nhận thông báo từ " + v.title}
                      key={v.value}
                    />
                  ))}
                </FormGroup>
              </div>
              
            </div>
          </div>
        )}
        {selectedTab === "Thông tin" && (
          <div>
            <p className="mt-6 opacity-60">Thông tin cơ bản</p>
            <div className="flex flex-col gap-4 pt-6">
              <div className="flex items-center">
                <p className="w-[134px] font-semibold">Điện thoại</p>
                <p className="font-semibold text-accent">{currentPerson.phone}</p>
              </div>
              <div className="flex items-center">
                <p className="w-[134px] font-semibold">Địa chỉ</p>
                <p className="font-semibold text-accent">{currentPerson.address}</p>
              </div>
              <div className="flex items-center">
                <p className="w-[134px] font-semibold">Công ty</p>
                <p className="font-semibold text-accent">
                  {currentPerson.company?.companyName || "..."}
                </p>
              </div>
              <div className="flex items-center">
                <p className="w-[134px] font-semibold">Email</p>
                <p className="font-semibold text-accent">{currentPerson.email}</p>
              </div>
            </div>
            <p className="mt-6 opacity-60">Thông tin thêm</p>
            <div className="flex flex-col gap-4 pt-6">
              <div className="flex items-center">
                <p className="w-[134px] font-semibold">Ngày sinh</p>
                <p className="font-semibold text-accent">
                  {moment(ticksToDate(currentPerson.dob)).format("DD-MM-YYYY")}
                </p>
              </div>
              <div className="flex items-center">
                <p className="w-[134px] font-semibold">Giới tính</p>
                <p className="font-semibold text-accent">
                  {currentPerson.gender === 1 ? "Nam" : "Nữ"}
                </p>
              </div>
              {currentPerson.idCardNumber ? (
                <div className="flex items-center">
                  <p className="w-[134px] font-semibold">Mã thẻ</p>
                  <p className="font-semibold text-accent">{currentPerson.idCardNumber}</p>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        )}
        {selectedTab === "Đổi mật khẩu" && (
          <div className="flex flex-col gap-4 py-6">
            {/* old pass */}
            <div className="group relative flex items-center">
              <div className="flex min-w-[100px] items-center">
                <label htmlFor="" className="text-secondary whitespace-nowrap">
                  Mật khẩu cũ
                </label>
                <RequireText />
              </div>

              <input
                maxLength={150}
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                type="text"
                className={cn(
                  "common-input-border w-full rounded-md p-2 leading-5 shadow-sm",
                  showPassword ? "" : "security"
                )}
              />
              <HiOutlineEye
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
                className="absolute right-3 top-1/2 hidden -translate-y-1/2 cursor-pointer hover:opacity-60 group-hover:block"
                size={15}
                color="#666"
              />
            </div>

            {/* pass */}
            <div className="group relative flex items-center">
              <div className="flex min-w-[100px] items-center">
                <label htmlFor="" className="text-secondary whitespace-nowrap">
                  Mật khẩu mới
                </label>
                <RequireText />
              </div>
              <Tooltip
                open={openPassTooltip}
                title="Mật khẩu ít nhất 8 kí tự, gồm chữ, số và kí tự đặc biệt!"
                arrow
                placement="top-start"
                componentsProps={{
                  tooltip: {
                    sx: {
                      minWidth: "max-content",
                      whiteSpace: "nowrap",
                      fontSize: "13px",
                      padding: "12px",
                      bgcolor: "#222",
                      "& .MuiTooltip-arrow": {
                        color: "#222"
                      }
                    }
                  }
                }}
              >
                <input
                  onFocus={() => setFocusPassword(true)}
                  onBlur={() => setFocusPassword(false)}
                  maxLength={150}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  type="text"
                  className={cn(
                    "common-input-border w-full rounded-md p-2 leading-5 shadow-sm",
                    showPassword ? "" : "security"
                  )}
                />
              </Tooltip>
              <HiOutlineEye
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
                className="absolute right-3 top-1/2 hidden -translate-y-1/2 cursor-pointer hover:opacity-60 group-hover:block"
                size={15}
                color="#666"
              />
            </div>

            {/* retype pass */}
            <div className="group relative flex items-center">
              <div className="flex min-w-[100px] items-center">
                <label htmlFor="" className="text-secondary whitespace-nowrap">
                  Nhập lại
                </label>
                <RequireText />
              </div>
              <Tooltip
                open={openRePassTooltip}
                title="Nhập lại mật khẩu chưa khớp!"
                arrow
                placement="bottom-start"
                componentsProps={{
                  tooltip: {
                    sx: {
                      minWidth: "max-content",
                      whiteSpace: "nowrap",
                      fontSize: "13px",
                      padding: "12px",
                      bgcolor: "#222",
                      "& .MuiTooltip-arrow": {
                        color: "#222"
                      }
                    }
                  }
                }}
              >
                <input
                  onFocus={() => setFocusRePassword(true)}
                  onBlur={() => setFocusRePassword(false)}
                  maxLength={150}
                  value={rePassword}
                  onChange={e => setRePassword(e.target.value)}
                  type="text"
                  className={cn(
                    "common-input-border w-full rounded-md p-2 leading-5 shadow-sm",
                    showPassword ? "" : "security"
                  )}
                />
              </Tooltip>
              <HiOutlineEye
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
                className="absolute right-3 top-1/2 hidden -translate-y-1/2 cursor-pointer hover:opacity-60 group-hover:block"
                size={15}
                color="#666"
              />
            </div>
            <div className="flex justify-end gap-3">
              {isLoading && <CircularProgress size={18} />}
              <CustomButton onClick={handleChangePassword}>Đổi mật khẩu</CustomButton>
            </div>
          </div>
        )}
        {selectedTab === "Cập nhật thông tin" && (
          <div className="flex flex-col gap-4 py-6">
            {/* full name */}
            <div className="group relative flex items-center">
              <div className="flex min-w-[100px] items-center">
                <label htmlFor="" className="text-secondary whitespace-nowrap">
                  Họ và tên
                </label>
                <RequireText />
              </div>

              <input
                maxLength={150}
                value={infoUpdate.fullname}
                onChange={e => onChangeBindInfo(e.target.value, "fullname")}
                type="text"
                className={cn(
                  "common-input-border w-full rounded-md p-2 leading-5 shadow-sm"
                )}
              />
              
            </div>
            {/* phone number */}
            <div className="group relative flex items-center">
              <div className="flex min-w-[100px] items-center">
                <label htmlFor="" className="text-secondary whitespace-nowrap">
                  Số điện thoại
                </label>
                <RequireText />
              </div>

              <input
                maxLength={150}
                value={infoUpdate.phone??""}
                onChange={e => onChangeBindInfo(e.target.value, "phone")}
                type="number"
                className={cn(
                  "common-input-border w-full rounded-md p-2 leading-5 shadow-sm"
                )}
              />
              
            </div>
            {/* Address */}
            <div className="group relative flex items-center">
              <div className="flex min-w-[100px] items-center">
                <label htmlFor="" className="text-secondary whitespace-nowrap">
                  Địa chỉ
                </label>
                <RequireText />
              </div>

              <input
                maxLength={150}
                value={infoUpdate.address??""}
                onChange={e => onChangeBindInfo(e.target.value, "address")}
                type="text"
                className={cn(
                  "common-input-border w-full rounded-md p-2 leading-5 shadow-sm"
                )}
              />
              
            </div>
            <div className="flex justify-end gap-3">
              {isProcessUpdate && <CircularProgress size={18} />}
              <CustomButton onClick={handleUpdateInfo}>Cập nhật thông tin</CustomButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
