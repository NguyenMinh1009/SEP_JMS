import { Role } from "../enums/role";
import useCurrentPerson from "../hooks/store/useCurrentPerson";
import { AiFillStar, AiFillEye, AiFillEdit } from "react-icons/ai";
import { MdTextsms, MdPhotoCamera } from "react-icons/md";
import { BsCheck } from "react-icons/bs";
import { FaUser, FaLock } from "react-icons/fa";
import TaskPreview from "../components/TaskPreview";
import { useEffect, useState } from "react";
import moment from "moment";
import { dateToTicks, ticksToDate } from "../utils/Datetime";
import Images from "../img";
import RequireText from "../components/common/RequireText";
import { Accordion, AccordionDetails, AccordionSummary, CircularProgress, FormControlLabel, FormGroup, Switch, Tooltip, Typography, styled } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { HiOutlineEye } from "react-icons/hi";
import { cn } from "../utils/className";
import { APIUrlHost, commonRegex } from "../constants";
import CustomButton from "../components/common/CustomButton";
import useSnakeBar from "../hooks/store/useSnakeBar";
import APIClientInstance from "../api/AxiosInstance";
import { recursiveStructuredClone } from "../utils/recursiveStructuredClone";
import { info } from "console";
import ASwitchButton from "../components/common/ASwitchButton";
import useAvtRef from "../hooks/store/useCurrentAvatar";
import { DatePicker, viVN } from "@mui/x-date-pickers";

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
  const [currentInfo, setCurrentInfo] = useState<any>(null);

  const currentPerson = useCurrentPerson();
  const avtRef = useAvtRef();
  const snakeBar = useSnakeBar();

  // state for update information
  const [infoUpdate, setInfoUpdate] = useState<any>({});
  const onChangeBindInfo = (value: any, path: string) => {
    // console.log("Current info:", infoUpdate);
    let clone = { ...infoUpdate };
    clone[path] = value;
    setInfoUpdate(clone);
  }

  // Add more notification configurations
  const [notiState, setNotiState] = useState<boolean[]>([]);
  const [rNum, setRNum] = useState<number>(0);
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

  const getCurrentInfo = async () => {
    await APIClientInstance.get("user/profile").then(res => {
      setCurrentInfo(res.data);
    });
  };

  useEffect(() => {
    (selectedTab === "Thông tin") && getCurrentInfo();
  }, [selectedTab]);

  useEffect(() => {
    setInfoUpdate({
      avatarUrl: currentInfo?.avatarUrl,
      fullname: currentInfo?.fullname,
      phone: currentInfo?.phone,
      dob: currentInfo?.dob ? moment(ticksToDate(currentInfo?.dob)) : null,
      gender: currentInfo?.gender,
      address: currentInfo?.address
    })
    const currentData = JSON.parse(localStorage.getItem("user") ?? "");
    currentData.avatarUrl = currentInfo?.avatarUrl;
    currentPerson.setCurrentPerson?.(currentData);
  }, [currentInfo]);

  const notiItems = [
    {
      title: "Công việc",
      value: 0
    },
    {
      title: "Bình luận",
      value: 1
    },
  ];

  useEffect(() => {
    if (focusPassword && !commonRegex.password.test(password)) setOpenPassTooltip(true);
    else setOpenPassTooltip(false);
  }, [focusPassword, password]);

  useEffect(() => {
    // console.log(notiState);
    if (notiState.length === 0) {
      setIsProcessNotifyConfig(true);
      let currentCfg = currentPerson.notificationConfig.replace("[", "").replace("]", "").split(",");
      let clone: boolean[] = [];
      currentCfg.map(value => clone[parseInt(value)] = true);
      setIsProcessNotifyConfig(false);
      setRNum(rNum+1);
      if (rNum < 2) setNotiState(clone);
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
        return "Nhà thiết kế";
    }
  };

  const tabs = [

    {
      text: "Thông tin",
      icon: <FaUser size={14} />
      //element: <TaskPreview />
    },
    {
      text: "Cập nhật thông tin",
      icon: <AiFillEdit size={14} />
      //element: <TaskPreview />
    },
    {
      text: "Đổi mật khẩu",
      icon: <FaLock size={14} />
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

  const validateInput = async (): Promise<boolean> => {
    if (!infoUpdate.fullname.trim()) {
      snakeBar.setSnakeBar("Hãy điền đủ các trường!", "warning", true);
      return false;
    }

    if (infoUpdate.fullname.trim().length > 150) {
      snakeBar.setSnakeBar("Họ và tên vượt quá số kí tự cho phép (150)!", "warning", true);
      return false;
    }

    if (infoUpdate.address.trim().length > 150) {
      snakeBar.setSnakeBar("Địa chỉ vượt quá số kí tự cho phép (150)!", "warning", true);
      return false;
    }
    
    if (infoUpdate.phone.trim() && !commonRegex.phone.test(infoUpdate.phone)) {
      snakeBar.setSnakeBar("Số điện thoại sai định dạng!", "warning", true);
      return false;
    }

    return true;
  };

  const handleChangePassword = async () => {
    if (!oldPassword.trim()) {
      snakeBar.setSnakeBar("Hãy điền đủ các trường!", "warning", true);
      return;
    }

    if (password.trim() !== rePassword.trim()) {
      snakeBar.setSnakeBar("Nhập lại mật khẩu không khớp!", "warning", true);
      return false;
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

  const handleUpdateInfo = async () => {
    var rs = await validateInput();
    if (!rs) return;
    setIsProcessUpdate(true);
    let dataPayload = {...infoUpdate}
    dataPayload.dob = infoUpdate.dob ? dateToTicks(infoUpdate.dob.toDate()) : undefined
    APIClientInstance.post("user/UpdateProfile", dataPayload)
      .then(() => {
        // bind for current person
        const currentData = JSON.parse(localStorage.getItem("user") ?? "");
        for (const prop in dataPayload) currentData[prop] = dataPayload[prop];
        currentPerson.setCurrentPerson?.(currentData);
        localStorage.setItem("user", JSON.stringify(currentData));
        window.dispatchEvent(new Event("storage"));

        // bind for current info
        const currentData1 = {...currentInfo};
        for (const prop in dataPayload) currentData1[prop] = dataPayload[prop];
        setCurrentInfo(currentData1);
        snakeBar.setSnakeBar("Cập nhật thông tin thành công!", "success", true);
      })
      .catch(() => {
        snakeBar.setSnakeBar("Có lỗi xảy ra!", "error", true);
      })
      .finally(() => {
        setIsProcessUpdate(false);
      });
  };

  const avatarHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/png");
    input.click();
    input.onchange = (e: any) => {
      // console.log(input.files);
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      APIClientInstance.post("user/avatar", formData).then(e => {
        getCurrentInfo();
        
        avtRef.setContent(Date.now());
      });
    };
  };

  return (
    <div className="flex h-full gap-12">
      <div className="flex w-1/4 max-w-[300px] flex-col items-start">
        <div className="group relative mb-9 aspect-square w-full cursor-pointer overflow-hidden rounded-md bg-slate-500">
          <img
            src={currentInfo?.avatarUrl ? APIUrlHost + "/" + currentInfo?.avatarUrl + "?t=" + avtRef.content : Images.avtPlaceHolder}
            alt=""
            className="w-full object-cover"
          />
          <div className="absolute left-0 top-full flex h-2/5 w-full flex-col items-center justify-center gap-2 bg-black bg-opacity-30 transition-all group-hover:top-[60%]" onClick={avatarHandler}>
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
              {moment(ticksToDate(currentInfo?.createdTime)).format("DD-MM-YYYY") || "..."}
            </p>
          </div>
          {currentInfo?.roleType !== Role.CUSTOMER && (
            <>
              <div className="mb-4">
                <div className="mb-2 flex gap-1">
                  <p className="text-sm text-[#999]">Ngày tham gia</p>
                  <div className="mb-[2px] flex-1 border-b-2" />
                </div>
                <p className="font-semibold text-accent">
                  {moment(ticksToDate(currentInfo?.onboardTime)).format("DD-MM-YYYY") || "..."}
                </p>
              </div>
              <div className="">
                <div className="mb-2 flex gap-1">
                  <p className="text-sm text-[#999]">Ngày nghỉ</p>
                  <div className="mb-[2px] flex-1 border-b-2" />
                </div>
                <p className="font-semibold text-accent">
                  {currentInfo?.offboardTime
                    ? moment(ticksToDate(currentInfo?.offboardTime)).format("DD-MM-YYYY")
                    : "Chưa có thông tin"}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="vertical-grid-container col-span-15">
        <div>
          <p className="text-primary text-2xl font-bold">{currentInfo?.fullname}</p>
          <p className="text-secondary mb-4 font-semibold text-accent">
            {getRoleText(currentInfo?.roleType)}
          </p>
          <div className="flex w-fit items-end gap-6 border-b-2">
            {tabs.map(tab => (
              <div
                onClick={() => setSelectedTab(tab.text)}
                className={`-mb-[2px] flex cursor-pointer items-center gap-2 pb-2 hover:opacity-80 ${selectedTab === tab.text
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
                      style={{ marginLeft: "0px" }}
                      value={v.value}
                      control={<ASwitchButton checked={notiState[v.value]} disabled={isProcessNotifyConfig} onChange={onNotiSwitchChange} />}
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
                <p className="font-semibold text-accent">{currentInfo?.phone}</p>
              </div>
              <div className="flex items-center">
                <p className="w-[134px] font-semibold">Địa chỉ</p>
                <p className="font-semibold text-accent">{currentInfo?.address}</p>
              </div>
              <div className="flex items-center">
                <p className="w-[134px] font-semibold">Công ty</p>
                <p className="font-semibold text-accent">
                  {currentInfo?.company?.companyName || "..."}
                </p>
              </div>
              <div className="flex items-center">
                <p className="w-[134px] font-semibold">Email</p>
                <p className="font-semibold text-accent">{currentInfo?.email}</p>
              </div>
            </div>
            <p className="mt-6 opacity-60">Thông tin thêm</p>
            <div className="flex flex-col gap-4 pt-6">
              <div className="flex items-center">
                <p className="w-[134px] font-semibold">Ngày sinh</p>
                <p className="font-semibold text-accent">
                  {moment(ticksToDate(currentInfo?.dob)).format("DD-MM-YYYY")}
                </p>
              </div>
              <div className="flex items-center">
                <p className="w-[134px] font-semibold">Giới tính</p>
                <p className="font-semibold text-accent">
                  {currentInfo?.gender === 1 ? "Nam" : "Nữ"}
                </p>
              </div>
              {currentInfo?.idCardNumber ? (
                <div className="flex items-center">
                  <p className="w-[134px] font-semibold">Mã thẻ</p>
                  <p className="font-semibold text-accent">{currentInfo?.idCardNumber}</p>
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
                value={infoUpdate.phone ?? ""}
                onChange={e => onChangeBindInfo(e.target.value, "phone")}
                type="number"
                className={cn(
                  "common-input-border w-full rounded-md p-2 leading-5 shadow-sm"
                )}
              />

            </div>

            {/* Date of birth */}
            <div className="group relative flex items-center">
              <div className="flex min-w-[100px] items-center">
                <label htmlFor="" className="text-secondary whitespace-nowrap">
                  Ngày sinh
                </label>
                <RequireText />
              </div>

              <DatePicker
                localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}
                className="h-[40px] w-full"
                sx={{
                  "& .MuiInputBase-root": {
                    height: "40px"
                  },
                  "& .MuiSvgIcon-root": {
                    fontSize: "1rem"
                  }
                }}
                format="DD-MM-YYYY"
                closeOnSelect={false}
                value={infoUpdate.dob ?? null}
                onChange={(value) => onChangeBindInfo(value, "dob")}
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
                value={infoUpdate.address ?? ""}
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
