import { CircularProgress, Divider, MenuItem, Select, Tooltip } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import APIClientInstance from "../api/AxiosInstance";
import RequireText from "../components/common/RequireText";
import CustomButton from "../components/common/CustomButton";
import useSnakeBar from "../hooks/store/useSnakeBar";
import { useNavigate } from "react-router-dom";
import { PathString } from "../enums/MapRouteToBreadCrumb";
import { HiOutlineEye } from "react-icons/hi";
import { cn } from "../utils/className";
import { DatePicker, viVN } from "@mui/x-date-pickers";
import moment from "moment";
import { GenderType } from "../enums/genderType";
import { commonRegex, createRoleOptions, employeeOptions, genderOptions } from "../constants";
import { dateToTicks } from "../utils/Datetime";
import useCurrentSelectedRole from "../hooks/store/useCurrentSelectedRole";
import { CreateRole } from "../enums/createRole";

const CreateEmployee = () => {
  const [dob, setDob] = useState<moment.Moment | null>(null);
  const [onBoardTime, setOnBoardTime] = useState<moment.Moment | null>(null);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rePassword, setRePassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [fullname, setFullname] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [cardId, setCardId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [gender, setGender] = useState<GenderType>(GenderType.Male);
  const [role, setRole] = useState<CreateRole | null>(null);
  // const [showPrice, setShowPrice] = useState<boolean>(false);
  const [isButtonLoading, setButtonLoading] = useState<boolean>(false);
  const [focusPassword, setFocusPassword] = useState<boolean>(false);
  const [focusRePassword, setFocusRePassword] = useState<boolean>(false);
  const [openPassTooltip, setOpenPassTooltip] = useState<boolean>(false);
  const [openRePassTooltip, setOpenRePassTooltip] = useState<boolean>(false);
  const navigate = useNavigate();
  const snakeBar = useSnakeBar();
  const { selectedRole } = useCurrentSelectedRole();

  useEffect(() => {
    if (selectedRole !== CreateRole.COMPANY && selectedRole !== CreateRole.CUSTOMER)
      setRole(selectedRole);
    else setRole(CreateRole.ADMIN);
  }, [selectedRole]);

  useEffect(() => {
    if (focusPassword && !commonRegex.password.test(password)) setOpenPassTooltip(true);
    else setOpenPassTooltip(false);
  }, [focusPassword, password]);

  useEffect(() => {
    if (focusRePassword && password !== rePassword) setOpenRePassTooltip(true);
    else setOpenRePassTooltip(false);
  }, [focusRePassword, rePassword, password]);

  const resetState = () => {
    setDob(null);
    setOnBoardTime(null);
    setUsername("");
    setPassword("");
    setRePassword("");
    setFullname("");
    setAddress("");
    setCardId("");
    setEmail("");
    setPhone("");
    setGender(GenderType.Male);
  };

  const employeeText = useMemo(
    () => createRoleOptions.find(item => item.key === role)?.text,
    [role]
  );

  const handleCreateEmployee = async () => {
    const validateSuccess = await validateInput();

    if (!validateSuccess) return;
    setButtonLoading(true);
    APIClientInstance.post("admin/add/employee", {
      username: username.trim(),
      password: password.trim(),
      fullname: fullname.trim(),
      email: email.trim(),
      phone: phone.trim(),
      dob: dob ? dateToTicks(dob.toDate()) : undefined,
      onBoardTime: dateToTicks(onBoardTime ? onBoardTime.toDate() : new Date()),
      idCardNumber: cardId,
      address: address,
      gender: gender,
      roleType: role,
      hiddenPrice: true
    })
      .then(() => {
        snakeBar.setSnakeBar(`Tạo ${employeeText} thành công`, "success", true);
        resetState();
      })
      .catch(err => {
        snakeBar.setSnakeBar("Có lỗi xảy ra! [" + err.response.data + "]", "error", true);
      })
      .finally(() => {
        setButtonLoading(false);
      });
  };

  const handleCancelJob = () => {
    navigate(location.pathname.replace(`/${PathString.CREATE_EMPLOYEE}`, ""));
  };

  const isButtonDisabled =
    !username.trim() || !commonRegex.password.test(password) || !rePassword || !fullname.trim();

  const validateInput = async (): Promise<boolean> => {
    if (password?.trim() !== rePassword.trim()) {
      snakeBar.setSnakeBar("Nhập lại mật khẩu không khớp!", "warning", true);
      return false;
    }
    if (email?.trim() && !commonRegex.email.test(email)) {
      snakeBar.setSnakeBar("Email sai định dạng!", "warning", true);
      return false;
    }
    if (phone?.trim() && !commonRegex.phone.test(phone)) {
      snakeBar.setSnakeBar("Số điện thoại sai định dạng!", "warning", true);
      return false;
    }

    if (username?.trim() && !commonRegex.username.test(username.trim())) {
      snakeBar.setSnakeBar("Username chỉ gồm kí tự và số, không có dấu cách!", "warning", true);
      return false;
    }

    const {
      data: { isValid }
    } = await APIClientInstance.post("admin/username/validate", {
      username: username.trim()
    });

    if (!isValid) {
      snakeBar.setSnakeBar("Username đã tồn tại!", "warning", true);
      return false;
    }
    return true;
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-6">
        <p className="text-primary text-base">Tạo mới nhân viên</p>
        <div className="h-5 w-[1px] bg-slate-600 opacity-50"></div>
        <p
          onClick={() => navigate(`/${PathString.USERS}/${PathString.CREATE_COMPANY}`)}
          className="text-primary cursor-pointer text-xs opacity-30 transition-all hover:opacity-60"
        >
          Tạo mới company
        </p>
        <div className="h-5 w-[1px] bg-slate-600 opacity-50"></div>
        <p
          onClick={() => navigate(`/${PathString.USERS}/${PathString.CREATE_CUSTOMER}`)}
          className="text-primary cursor-pointer text-xs opacity-30 transition-all hover:opacity-60"
        >
          Tạo mới khách hàng
        </p>


      </div>
      <Divider />
      <div className="flex max-w-[550px] grid-cols-2 flex-col gap-x-12 gap-y-4 py-6 md:grid md:max-w-[1000px] xl:gap-x-24">
        {/* employee role */}
        <div className="order-last flex items-center md:order-1">
          <div className="flex min-w-[120px] items-center">
            <label htmlFor="" className="text-secondary whitespace-nowrap">
              Loại tài khoản
            </label>
            <RequireText />
          </div>
          <Select
            fullWidth
            size="small"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={role}
            onChange={e => setRole(e.target.value as CreateRole)}
            sx={{
              "& .MuiInputBase-inputSizeSmall": {
                fontSize: "13px !important"
              },
              maxWidth: "100%"
            }}
          >
            {employeeOptions.map(({ key, text }) => (
              <MenuItem key={key} value={key}>
                {text}
              </MenuItem>
            ))}
          </Select>
        </div>

        {/* username */}
        <div className="order-last flex items-center md:order-3">
          <div className="flex min-w-[120px] items-center">
            <label htmlFor="" className="text-secondary whitespace-nowrap">
              Username
            </label>
            <RequireText />
          </div>
          <input
            maxLength={150}
            value={username}
            onChange={e => setUsername(e.target.value)}
            type="text"
            className="common-input-border w-full rounded-md p-2 leading-5 shadow-sm"
          />
        </div>

        {/* pass */}
        <div className="group relative order-last flex items-center md:order-5">
          <div className="flex min-w-[120px] items-center">
            <label htmlFor="" className="text-secondary whitespace-nowrap">
              Password
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
        <div className="group relative order-last flex items-center md:order-7">
          <div className="flex min-w-[120px] items-center">
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

        {/* họ tên */}
        <div className="order-last flex items-center md:order-2">
          <div className="flex min-w-[120px] items-center">
            <label htmlFor="" className="text-secondary whitespace-nowrap">
              Họ và tên
            </label>
            <RequireText />
          </div>
          <input
            maxLength={150}
            value={fullname}
            onChange={e => setFullname(e.target.value)}
            type="text"
            className="common-input-border w-full rounded-md p-2 leading-5 shadow-sm"
          />
        </div>

        {/* Địa chỉ */}
        <div className="order-last flex items-center md:order-4">
          <label htmlFor="" className="text-secondary min-w-[120px] whitespace-nowrap">
            Địa chỉ
          </label>
          <input
            maxLength={150}
            value={address}
            onChange={e => setAddress(e.target.value)}
            type="text"
            className="common-input-border w-full rounded-md p-2 leading-5 shadow-sm"
          />
        </div>

        {/* email */}
        <div className="order-last flex items-center md:order-6">
          <div className="flex min-w-[120px] items-center">
            <label htmlFor="" className="text-secondary whitespace-nowrap">
              Email
            </label>
          </div>
          <input
            maxLength={150}
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            className="common-input-border w-full rounded-md p-2 leading-5 shadow-sm"
          />
        </div>

        {/* phone */}
        <div className="order-last flex items-center">
          <div className="flex min-w-[120px] items-center">
            <label htmlFor="" className="text-secondary whitespace-nowrap">
              Điện thoại
            </label>
          </div>
          <input
            maxLength={150}
            value={phone}
            onChange={e => setPhone(e.target.value)}
            type="tel"
            pattern="^(0|\+84)\d{9,10}$"
            className="common-input-border w-full rounded-md p-2 leading-5 shadow-sm"
          />
        </div>

        {/* card id */}
        <div className="order-last flex items-center">
          <div className="flex min-w-[120px] items-center">
            <label htmlFor="" className="text-secondary whitespace-nowrap">
              Card ID
            </label>
          </div>
          <input
            maxLength={150}
            value={cardId}
            onChange={e => setCardId(e.target.value)}
            type="text"
            className="common-input-border w-full rounded-md p-2 leading-5 shadow-sm"
          />
        </div>

        {/* dob */}
        <div className="order-last flex items-center">
          <div className="flex min-w-[120px] items-center">
            <label htmlFor="" className="text-secondary whitespace-nowrap">
              Ngày sinh
            </label>
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
            value={dob}
            onChange={value => {
              setDob(value);
            }}
          />
        </div>

        {/* onboard time */}
        <div className="order-last flex items-center">
          <div className="flex min-w-[120px] items-center">
            <label htmlFor="" className="text-secondary whitespace-nowrap">
              Ngày tham gia
            </label>
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
            value={onBoardTime}
            onChange={value => {
              setOnBoardTime(value);
            }}
          />
        </div>

        {/* Giới tính */}
        <div className="order-last flex items-center">
          <div className="flex min-w-[120px] items-center">
            <label htmlFor="" className="text-secondary whitespace-nowrap">
              Giới tính
            </label>
            <RequireText />
          </div>
          <Select
            fullWidth
            size="small"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={gender}
            onChange={e => setGender(e.target.value as GenderType)}
            sx={{
              "& .MuiInputBase-inputSizeSmall": {
                fontSize: "13px !important"
              },
              maxWidth: "100%"
            }}
          >
            {genderOptions.map(({ key, text }) => (
              <MenuItem key={key} value={key}>
                {text}
              </MenuItem>
            ))}
          </Select>
        </div>

        {/* giá */}
        {/* <div className="order-last flex items-center">
          <div className="flex min-w-[120px] items-center">
            <label htmlFor="" className="text-secondary whitespace-nowrap">
              Hiện giá
            </label>
            <RequireText />
          </div>
          <div
            onClick={() => setShowPrice(!showPrice)}
            className="relative my-2 flex h-[24px] w-12 cursor-pointer items-center gap-2 rounded-full bg-slate-200"
          >
            <div
              className={cn(
                "absolute bottom-1 top-1 aspect-square rounded-full bg-accent transition-all",
                !showPrice ? "left-1 bg-gray-500" : "left-[27px]"
              )}
            />
          </div>
        </div> */}
      </div>
      {/* <Divider /> */}
      <div className="my-1 flex max-w-[550px] items-center justify-end gap-4 py-4 md:max-w-[1000px]">
        <CustomButton onClick={handleCancelJob} className="font-[500] normal-case text-gray-500">
          Trở lại
        </CustomButton>
        <CustomButton
          onClick={handleCreateEmployee}
          disabled={isButtonDisabled}
          primary
          className="px-3 font-[400] normal-case text-white"
        >
          {`Tạo ${employeeText}`}
        </CustomButton>
        {isButtonLoading && <CircularProgress size={20} />}
      </div>
    </div>
  );
};

export default CreateEmployee;
