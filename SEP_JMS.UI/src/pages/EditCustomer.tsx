import {
  Autocomplete,
  Checkbox,
  CircularProgress,
  Divider,
  MenuItem,
  Select,
  TextField,
  Tooltip
} from "@mui/material";
import { useEffect, useState } from "react";
import APIClientInstance from "../api/AxiosInstance";
import RequireText from "../components/common/RequireText";
import CustomButton from "../components/common/CustomButton";
import useSnakeBar from "../hooks/store/useSnakeBar";
import { useNavigate, useParams } from "react-router-dom";
import { PathString } from "../enums/MapRouteToBreadCrumb";
import { HiOutlineEye } from "react-icons/hi";
import { cn } from "../utils/className";
import { DatePicker, viVN } from "@mui/x-date-pickers";
import moment from "moment";
import { GenderType } from "../enums/genderType";
import { accountStatusOptions, commonRegex, genderOptions } from "../constants";
import { BasicCompanyType, CompanyResponseType } from "../interface/company";
import { dateToTicks, ticksToDate } from "../utils/Datetime";
import { UsersPreviewData } from "../interface/usersPreviewData";
import useTitle from "../hooks/store/useCurrentTitle";
import { AccountStatusType } from "../enums/accountStatusType";
import ASwitchButton from "../components/common/ASwitchButton";
import { CreateRole } from "../enums/createRole";
import useTempSelectedRole from "../hooks/store/useCurrentTempRole";

const EditCustomer = () => {
  const [dob, setDob] = useState<moment.Moment | null>(null);
  const [initUsername, setInitUsername] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rePassword, setRePassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [fullname, setFullname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [gender, setGender] = useState<GenderType>(GenderType.Male);
  const [status, setStatus] = useState<AccountStatusType>(AccountStatusType.Active);
  const [selectedCompany, setSelectedCompany] = useState<BasicCompanyType | null>(null);
  const [companies, setCompanies] = useState<BasicCompanyType[]>([]);
  const [showPrice, setShowPrice] = useState<boolean>(false);
  const [isButtonLoading, setButtonLoading] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [focusPassword, setFocusPassword] = useState<boolean>(false);
  const [focusRePassword, setFocusRePassword] = useState<boolean>(false);
  const [openPassTooltip, setOpenPassTooltip] = useState<boolean>(false);
  const [openRePassTooltip, setOpenRePassTooltip] = useState<boolean>(false);
  const [passwordChecked, setChangePasswordChecked] = useState<boolean>(false);
  const [notifyEmail, setNotifyEmail] = useState<boolean>(true);
  const snakeBar = useSnakeBar();
  const { userId } = useParams();
  const navigate = useNavigate();
  const userTitle = useTitle();
  const { setRole: setTempRole } = useTempSelectedRole();

  useEffect(() => {
    void getCustomerInfo();
    void getCompanies();
  }, []);

  useEffect(() => {
    if (!passwordChecked) {
      setPassword("");
      setRePassword("");
    }
  }, [passwordChecked]);

  useEffect(() => {
    if (focusPassword && !commonRegex.password.test(password)) setOpenPassTooltip(true);
    else setOpenPassTooltip(false);
  }, [focusPassword, password]);

  useEffect(() => {
    if (focusRePassword && password !== rePassword) setOpenRePassTooltip(true);
    else setOpenRePassTooltip(false);
  }, [focusRePassword, rePassword, password]);

  const handleChangePasswordCheckBox = (
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setChangePasswordChecked(checked);
  };

  const handleNotifyEmailCheckBox = (
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setNotifyEmail(checked);
  };

  const getCompanies = async () => {
    const companiesRes = await APIClientInstance.post("admin/company/all", {
      pageIndex: 1,
      pageSize: 2147483647
    });
    const rsList: CompanyResponseType[] | undefined = companiesRes.data?.items;
    if (rsList) {
      const cList = rsList.map(e => e.company);
      setCompanies(cList);
    }
  };

  const getCustomerInfo = async () => {
    const { data: result } = await APIClientInstance.get(`admin/getuser/${userId}`);
    setLoading(false);

    const currentCustomer: UsersPreviewData = result;
    setUsername(currentCustomer.username);
    setInitUsername(currentCustomer.username);
    setFullname(currentCustomer.fullname);
    setEmail(currentCustomer.email);
    setPhone(currentCustomer.phone ?? "");
    setDob(currentCustomer.dob ? moment(ticksToDate(currentCustomer.dob)) : null);
    setGender(currentCustomer.gender);
    setSelectedCompany(currentCustomer.company);
    setShowPrice(!currentCustomer.hiddenPrice);
    setStatus(currentCustomer.accountStatus);
    userTitle.setContent(`${currentCustomer.fullname} (${currentCustomer.username})`);
  };

  const handleEditCustomer = async () => {
    const validateSuccess = await validateInput();
    if (!validateSuccess) return;
    setButtonLoading(true);
    APIClientInstance.put(`admin/update/customer/${userId}`, {
      username: username.trim(),
      fullname: fullname.trim(),
      password: passwordChecked ? password.trim() : null,
      email: email.trim(),
      phone: phone.trim(),
      dob: dob ? dateToTicks(dob.toDate()) : undefined,
      gender: gender,
      companyId: selectedCompany?.companyId,
      hiddenPrice: !showPrice,
      isNotify: notifyEmail,
      accountStatus: status
    })
      .then(() => {
        snakeBar.setSnakeBar("Chỉnh sửa thông tin thành công", "success", true);
        handleCancelJob();
      })
      .catch(err => {
        snakeBar.setSnakeBar("Có lỗi xảy ra [" + err.response.data + "]", "error", true);
      })
      .finally(() => {
        setButtonLoading(false);
      });
  };

  const handleCancelJob = () => {
    setTempRole(CreateRole.CUSTOMER);
    navigate(`/${PathString.USERS}`);
  };

  const isButtonDisabled =
    !username.trim() ||
    !fullname.trim() ||
    !selectedCompany ||
    (passwordChecked && (!rePassword.trim() || !commonRegex.password.test(password.trim())));

  const isDisableSendMail = !passwordChecked || !commonRegex.email.test(email);

  const validateInput = async (): Promise<boolean> => {
    if (password.trim() !== rePassword.trim()) {
      snakeBar.setSnakeBar("Nhập lại mật khẩu không khớp!", "warning", true);
      return false;
    }
    if (email && email.trim() && !commonRegex.email.test(email)) {
      snakeBar.setSnakeBar("Email sai định dạng!", "warning", true);
      return false;
    }
    if (phone.trim() && !commonRegex.phone.test(phone)) {
      snakeBar.setSnakeBar("Số điện thoại sai định dạng!", "warning", true);
      return false;
    }

    if (!commonRegex.username.test(username.trim())) {
      snakeBar.setSnakeBar("Username chỉ gồm kí tự và số, không có dấu cách!", "warning", true);
      return false;
    }
    
    let isValid: boolean = true;
    if (username !== initUsername) {
      isValid = (
        await APIClientInstance.post("admin/username/validate", {
          username: username.trim()
        })
      ).data.isValid;
    }
    if (!isValid) {
      snakeBar.setSnakeBar("Username đã tồn tại!", "warning", true);
      return false;
    }
    return true;
  };

  return isLoading ? (
    <CircularProgress />
  ) : (
    <div>
      <div className="mb-6 flex items-center gap-6">
        <p className="text-primary text-base">Chỉnh sửa thông tin khách hàng</p>
        <div className="flex items-center">
          <ASwitchButton
            checked={passwordChecked}
            onChange={handleChangePasswordCheckBox}
            inputProps={{ "aria-label": "controlled" }}
          />
          <span>Thay đổi mật khẩu</span>
        </div>
        <div className="flex items-center">
          <ASwitchButton
            checked={notifyEmail}
            disabled={isDisableSendMail}
            onChange={handleNotifyEmailCheckBox}
            inputProps={{ "aria-label": "controlled" }}
          />
          <span>Thông báo qua Email</span>
        </div>
      </div>
      <Divider />
      <div className="flex max-w-[550px] grid-cols-2 flex-col gap-x-12 gap-y-4 py-6 md:grid md:max-w-[1000px] xl:gap-x-24">
        {/* username */}
        <div className="order-last flex items-center md:order-1">
          <div className="flex min-w-[100px] items-center">
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
        <div className="group relative order-last flex items-center md:order-3">
          <div className="flex min-w-[100px] items-center">
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
              disabled={!passwordChecked}
              onFocus={() => setFocusPassword(true)}
              onBlur={() => setFocusPassword(false)}
              maxLength={150}
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="text"
              className={cn(
                "common-input-border w-full rounded-md p-2 leading-5 shadow-sm",
                showPassword ? "" : "security",
                passwordChecked ? "" : "bg-gray-100"
              )}
            />
          </Tooltip>
          {passwordChecked && (
            <HiOutlineEye
              onClick={() => {
                setShowPassword(!showPassword);
              }}
              className="absolute right-3 top-1/2 hidden -translate-y-1/2 cursor-pointer hover:opacity-60 group-hover:block"
              size={15}
              color="#666"
            />
          )}
        </div>

        {/* retype pass */}
        <div className="group relative order-last flex items-center md:order-5">
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
              disabled={!passwordChecked}
              onFocus={() => setFocusRePassword(true)}
              onBlur={() => setFocusRePassword(false)}
              maxLength={150}
              value={rePassword}
              onChange={e => setRePassword(e.target.value)}
              type="text"
              className={cn(
                "common-input-border w-full rounded-md p-2 leading-5 shadow-sm",
                showPassword ? "" : "security",
                passwordChecked ? "" : "bg-gray-100"
              )}
            />
          </Tooltip>
          {passwordChecked && (
            <HiOutlineEye
              onClick={() => {
                setShowPassword(!showPassword);
              }}
              className="absolute right-3 top-1/2 hidden -translate-y-1/2 cursor-pointer hover:opacity-60 group-hover:block"
              size={15}
              color="#666"
            />
          )}
        </div>

        {/* họ tên */}
        <div className="order-last flex items-center md:order-2">
          <div className="flex min-w-[100px] items-center">
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

        {/* email */}
        <div className="order-last flex items-center md:order-4">
          <div className="flex min-w-[100px] items-center">
            <label htmlFor="" className="text-secondary whitespace-nowrap">
              Email
            </label>
            {/* <RequireText /> */}
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
          <div className="flex min-w-[100px] items-center">
            <label htmlFor="" className="text-secondary whitespace-nowrap">
              Điện thoại
            </label>
            {/* <RequireText /> */}
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

        {/* dob */}
        <div className="order-last flex items-center">
          <div className="flex min-w-[100px] items-center">
            <label htmlFor="" className="text-secondary whitespace-nowrap">
              Ngày sinh
            </label>
            {/* <RequireText /> */}
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

        {/* Giới tính */}
        <div className="order-last flex items-center">
          <div className="flex min-w-[100px] items-center">
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

        {/* account status */}
        <div className="order-last flex items-center">
          <div className="flex min-w-[100px] items-center">
            <label htmlFor="" className="text-secondary whitespace-nowrap">
              Trạng thái
            </label>
            <RequireText />
          </div>
          <Select
            fullWidth
            size="small"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={status}
            onChange={e => setStatus(e.target.value as AccountStatusType)}
            sx={{
              "& .MuiInputBase-inputSizeSmall": {
                fontSize: "13px !important"
              },
              maxWidth: "100%"
            }}
          >
            {accountStatusOptions.map(({ key, text }) => (
              <MenuItem key={key} value={key}>
                {text}
              </MenuItem>
            ))}
          </Select>
        </div>

        {/* company */}
        <div className="order-last flex items-center">
          <div className="flex min-w-[100px] items-center">
            <label htmlFor="" className="text-secondary whitespace-nowrap">
              Company
            </label>
            <RequireText />
          </div>
          <Autocomplete
            noOptionsText="Không có lựa chọn"
            id="companies"
            value={selectedCompany}
            onChange={(_, newValue) => {
              if (newValue) setSelectedCompany(newValue);
            }}
            getOptionLabel={option => option.companyName}
            size="small"
            options={companies}
            fullWidth
            renderInput={params => (
              <TextField
                {...params}
                sx={{
                  "& .MuiInputBase-sizeSmall": {
                    height: "40px !important"
                  },
                  "& .MuiAutocomplete-input": { fontSize: "13px !important" }
                }}
                placeholder="-- Chọn company --"
              />
            )}
          />
        </div>

        {/* giá */}
        <div className="order-last flex items-center">
          <div className="flex min-w-[100px] items-center">
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
        </div>
      </div>
      {/* <Divider /> */}
      <div className="my-1 flex max-w-[550px] items-center justify-end gap-4 py-4 md:max-w-[1000px]">
        <CustomButton onClick={handleCancelJob} className="font-[500] normal-case text-gray-500">
          Trở lại
        </CustomButton>
        <CustomButton
          onClick={handleEditCustomer}
          disabled={isButtonDisabled}
          primary
          className="px-3 font-[400] normal-case text-white"
        >
          Chỉnh sửa khách hàng
        </CustomButton>
        {isButtonLoading && <CircularProgress size={20} />}
      </div>
    </div>
  );
};

export default EditCustomer;
