import React, { useEffect, useState } from "react";
import sanitize from "sanitize-html";
import CustomButton from "./CustomButton";
import { IoMdDocument } from "react-icons/io";
import { IoAddCircleOutline } from "react-icons/io5";
import { AiOutlineCloseCircle, AiFillCloseCircle } from "react-icons/ai";
import ReactQuill, { Quill } from "react-quill";
//@ts-ignore
import quillEmoji from "quill-emoji";
import "quill-emoji/dist/quill-emoji.css";

import ImageSection from "./ImageSection";
import FileSection from "../FileSection";
import useCurrentPerson from "../../hooks/store/useCurrentPerson";
import AlwayxInstance from "../../api/AxiosInstance";
import { dateToTicks } from "../../utils/Datetime";
import useSnakeBar from "../../hooks/store/useSnakeBar";
import { jobOptions, JobType } from "../../enums/jobType";
import { Priority, priorityOptions } from "../../enums/priority";
import { useLocation, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { CorrelationJobType } from "../../enums/correlationJobType";
import { Role } from "../../enums/Role";
import { VisibleType } from "../../enums/visibleType";
import { Autocomplete, MenuItem, Select, TextField } from "@mui/material";
import {
  internalStatusFilterOptions,
  internalStatusOptions,
  statusFilterOptions,
  statusOptions
} from "./StatusSection";
import { JobStatusType } from "../../enums/jobStatusType";
import RequireText from "./RequireText";
import { allowFileTypes, correlationJobOptions, defaultCompany } from "../../constants";
import { PathString } from "../../enums/MapRouteToBreadCrumb";
import { cn } from "../../utils/className";
import { MdOutlineExpandCircleDown } from "react-icons/md";
import { DateTimePicker, viVN } from "@mui/x-date-pickers";
import moment from "moment";
import { checkInputCreateJob } from "../../utils/checkInputJob";
import APIClientInstance from "../../api/AxiosInstance";
import { InternalJobStatusType } from "../../enums/internalJobStatusType";
import { TaskString } from "../../enums/taskEnums";
import { ToastString } from "../../enums/toastEnums";

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ align: [] }],
  ["emoji"],
  window.innerWidth > 1537 ? [{ script: "sub" }, { script: "super" }] : [], // superscript/subscript
  window.innerWidth > 1537 ? [{ indent: "-1" }, { indent: "+1" }] : [] // outdent/indent
];

const quillModules = {
  toolbar: toolbarOptions,
  "emoji-toolbar": true,
  "emoji-textarea": true,
  "emoji-shortname": true
};

interface ICreateTaskProp {
  label: string;
  correlationJobType: CorrelationJobType;
  visibleType: VisibleType;
  finishedOnly?: boolean;
}

const getDefaultDeadline = (): Date => {
  const curr = new Date();
  curr.setDate(curr.getDate() + 7);
  return curr;
};
const CreateTask: React.FC<ICreateTaskProp> = ({
  label,
  correlationJobType,
  visibleType,
  finishedOnly
}) => {
  const [value, setValue] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState<string>("");
  const [selectedJobType, setSelectedJobType] = useState<{
    typeId: any;
    typeName: string;
  } | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  const [selectedDesigner, setSelectedDesigner] = useState<any | null>(null);

  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);

  const [selectedAccount, setSelectedAccount] = useState<any | null>(null);

  const [deadline, setDeadline] = useState<moment.Moment | null>(moment(getDefaultDeadline()));
  const [quantity, setQuantity] = useState<number>(1);
  // const [price, setPrice] = useState<number | undefined>();
  const [selectedPriority, setSelectedPriority] = useState<Priority>(Priority.MEDIUM);
  const [selectedStatus, setSelectedStatus] = useState<JobStatusType | InternalJobStatusType>(
    JobStatusType.NotDo | InternalJobStatusType.NotDo
  );
  // const [selectedCorrelationJobType, setSelectedCorrelationJobType] =
  // useState<CorrelationJobType>(correlationJobType);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [designers, setDesigners] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [jobtypes, setJobtypes] = useState<any[]>([]);
  const [currentInfo, setCurrentInfo] = useState<any>(null);

  const [openDetailsEditPanel, setOpenDetailsEditPanel] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  const currentPerson = useCurrentPerson();
  const snakeBar = useSnakeBar();

  Quill.register(
    {
      "formats/emoji": quillEmoji.EmojiBlot,
      "modules/emoji-toolbar": quillEmoji.ToolbarEmoji,
      "modules/emoji-textarea": quillEmoji.TextAreaEmoji,
      "modules/emoji-shortname": quillEmoji.ShortNameEmoji
    },
    true
  );

  const fileHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", allowFileTypes);
    input.setAttribute("multiple", "");
    input.click();
    input.onchange = (e: any) => {
      const fileList = Array.from(input.files ?? []);
      setFiles(prev => [...prev, ...fileList]);
    };
  };

  const getImagesFiles = React.useMemo(() => {
    return Array.from(files).filter(file => file.type.includes("image"));
  }, [files]);

  const getDocumentsFiles = React.useMemo(() => {
    return Array.from(files).filter(file => !file.type.includes("image"));
  }, [files]);

  const getSanitizeText = (input: string) => {
    return sanitize(input, {
      allowedTags: sanitize.defaults.allowedTags.concat(["img"]),
      allowedAttributes: false,
      allowedSchemes: ["data", "http", "https"],
      transformTags: {
        br: ""
      }
    });
  };

  const getCustomerListForStaff = () => {
    setLoading(true);
    AlwayxInstance.post("customer/find", {
      pageIndex: 1,
      pageSize: 2147483647,
      searchText: null,
      companyId: selectedCompany?.companyId ?? defaultCompany.companyId
    })
      .then(res => {
        setCustomers(res.data.items);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const getDesignerList = () => {
    AlwayxInstance.post("user/search", {
      pageIndex: 1,
      pageSize: 2147483647,
      getOrderList,
      searchText: null,
      role: Role.DESIGNER
    })
      .then(res => setDesigners(res.data.items))
      .catch(err => console.error(err));
  };

  const getAccountList = () => {
    if (currentPerson.roleType === Role.ACCOUNT || currentPerson.roleType === Role.DESIGNER) return;
    AlwayxInstance.post("user/search", {
      pageIndex: 1,
      pageSize: 2147483647,
      searchText: null,
      role: Role.ACCOUNT
    })
      .then(res => setAccounts(res.data.items))
      .catch(err => console.error(err));
  };

  const getOrderList = () => {
    AlwayxInstance.post("company/active", {
      pageIndex: 1,
      pageSize: 2147483647,
      searchText: ""
    })
      .then(res => setCompanies(res.data.items))
      .catch(err => console.error(err));
  };

  const getJobTypeList = () => {
    AlwayxInstance.get("jobtype/all")
      .then(res => setJobtypes(res.data))
      .catch(err => console.error(err));
  };

  const getCorrelationJobOptions = () => {
    switch (correlationJobType) {
      case CorrelationJobType.Job:
        return (
          <>
            <label htmlFor="" className="text-primary col-span-2">
              {TaskString.SO_LUONG}
              <RequireText />
            </label>
            <input
              type="number"
              value={quantity}
              min={0}
              onChange={e => setQuantity(Number(e.target.value))}
              className="h-10 w-full rounded-[4px] border-[1px] border-[rgba(0,0,0,0.23)] p-2 leading-5 shadow-sm"
            />
          </>
        );
      case CorrelationJobType.Project:
        return (
          <>
            {/* <input
              type="hidden"
              value={1}
              min={0}
              onChange={e => setQuantity(Number(e.target.value))}
              className="h-10 w-full rounded-[4px] border-[1px] border-[rgba(0,0,0,0.23)] p-2 leading-5 shadow-sm"
            /> */}
          </>
        );
    }
  };

  const getCustomerId = () => {
    return currentPerson.roleType !== Role.CUSTOMER
      ? selectedCustomer?.userId
      : currentPerson.userId;
  };

  const getAccountId = () => {
    return selectedAccount?.userId ?? "";
  };

  const handlePost = () => {
    const totalSizeInBytes = files.reduce((total, file) => total + file.size, 0);
    if (totalSizeInBytes / (1024 * 1024) > 100) {
      snakeBar.setSnakeBar(ToastString.TONG_TAI_LIEU_VUOT_QUA_100MB, "warning", true);
      return;
    }

    //check validate input create job
    var errors = checkInputCreateJob(quantity, deadline);
    errors.forEach(error => {
      snakeBar.setSnakeBar(error, "warning", true);
    });
    if (errors.length !== 0) return;

    setLoading(true);
    const formData = new FormData();
    const jobPayloadData = {
      customerId: getCustomerId(),
      accountId: getAccountId(),
      title: title,
      description: getSanitizeText(value),
      designerId: selectedDesigner?.userId ?? "",
      quantity: correlationJobType === CorrelationJobType.Job ? quantity : 1,
      jobType: selectedJobType?.typeId,
      jobStatus: JobStatusType.NotDo,
      deadline: dateToTicks(deadline ? deadline.toDate() : new Date()),
      priority: selectedPriority,
      correlationType: correlationJobType
    };
    // append files and data to formData
    files.forEach(item => formData.append("requirementFiles", item));
    Object.keys(jobPayloadData).forEach((key: string) => {
      formData.append(key, jobPayloadData[key as keyof typeof jobPayloadData]);
    });

    AlwayxInstance.post("job", formData)
      .then(res => {
        const jobDetail = res.data;
        switch (visibleType) {
          case VisibleType.Public:
            {
              correlationJobType === CorrelationJobType.Job
                ? finishedOnly
                  ? navigate(
                      `/${PathString.VIEC_DA_XONG}/${PathString.VIEC_HANG_NGAY}/${jobDetail.jobId}`
                    )
                  : navigate(
                      `/${PathString.CONG_KHAI}/${PathString.VIEC_HANG_NGAY}/${jobDetail.jobId}`
                    )
                : finishedOnly
                ? navigate(
                    `/${PathString.VIEC_DA_XONG}/${PathString.VIEC_DU_AN}/${jobDetail.jobId}`
                  )
                : navigate(`/${PathString.CONG_KHAI}/${PathString.VIEC_DU_AN}/${jobDetail.jobId}`);
            }

            break;
          case VisibleType.Internal:
            {
              correlationJobType === CorrelationJobType.Job
                ? navigate(`/${PathString.NOI_BO}/${PathString.VIEC_HANG_NGAY}/${jobDetail.jobId}`)
                : navigate(`/${PathString.NOI_BO}/${PathString.VIEC_DU_AN}/${jobDetail.jobId}`);
            }

            break;
          default:
            return;
        }
      })
      .then(() => {
        correlationJobType === CorrelationJobType.Job
          ? snakeBar.setSnakeBar(ToastString.TAO_CONG_VIEC_THANH_CONG, "success", true)
          : snakeBar.setSnakeBar(ToastString.TAO_DU_AN_THANH_CONG, "success", true);
      })
      .catch(err => {
        console.error(err);
        snakeBar.setSnakeBar(ToastString.TAO_KHONG_THANH_CONG, "error", true);
      });
  };

  const handleCancelJob = () => {
    navigate(location.pathname.replace(`/${PathString.THEM_MOI}`, ""));
  };

  const handleDeleteFile = (name: string) => {
    const clone = [...files];
    const deleteFileIndex = clone.findIndex(file => file.name === name);
    if (deleteFileIndex > -1) clone.splice(deleteFileIndex, 1);
    setFiles(clone);
  };

  const shouldDisableCreate = (): boolean => {
    if (!(getSanitizeText(value).trim() !== "" && getSanitizeText(value).trim() !== "<p></p>"))
      return true;
    if (isLoading) return true;
    if (title.trim() === "") return true;
    if (!selectedJobType) return true;
    if (!deadline) return true;
    if (!selectedAccount) return true;
    if (currentPerson.roleType !== Role.CUSTOMER) {
      if (!selectedCustomer || !selectedAccount) return true;
    }

    return false;
  };

  useEffect(() => {
    getDesignerList();
    getOrderList();
    getAccountList();
    getJobTypeList();
    getCurrentInfo();
  }, [currentPerson.roleType]);

  useEffect(() => {
    if (currentPerson.roleType === Role.ACCOUNT) {
      setSelectedAccount(currentPerson);
    }

    if (currentPerson.roleType === Role.CUSTOMER) {
      setSelectedCustomer(currentPerson);
    }
  }, [currentPerson.roleType]);

  const getCurrentInfo = async () => {
    await APIClientInstance.get("user/profile").then(res => {
      setCurrentInfo(res.data);
    });
  };

  useEffect(() => {
    if (currentPerson.roleType !== Role.CUSTOMER && currentPerson.roleType) {
      const fetchData = async () => {
        setSelectedCustomer(null);
        setCustomers([]);

        await getCustomerListForStaff();
        renderCustomerCreate();
      };
      fetchData();
    }
  }, [selectedCompany, currentPerson.roleType]);

  const renderCustomerCreate = () => {
    return (
      <div className="flex flex-col items-start gap-3">
        <label htmlFor="" className="text-primary col-span-2 mr-4">
          {TaskString.NGUOI_ORDER}
          <RequireText />
        </label>
        <Autocomplete
          loading={isLoading}
          noOptionsText="Không có lựa chọn"
          id="customers"
          value={selectedCustomer}
          onChange={(_, newValue) => {
            setSelectedCustomer(newValue);
          }}
          getOptionLabel={option => `${option.fullname} (${option.username})`}
          size="small"
          options={customers}
          fullWidth
          disabled={selectedCompany === null || currentPerson.roleType === Role.CUSTOMER}
          renderInput={params => (
            <TextField
              {...params}
              sx={{
                "& .MuiInputBase-sizeSmall": {
                  height: "40px !important"
                },
                "& .MuiAutocomplete-input": { fontSize: "13px !important" }
              }}
              placeholder={currentPerson.roleType === Role.CUSTOMER ? "" : "-- Chọn người order --"}
            />
          )}
        />
      </div>
    );
  };
  return (
    <div className="create-task relative -mx-2 -mt-2 grid h-max grid-cols-12 gap-6 px-2">
      <div
        onClick={() => setOpenDetailsEditPanel(!openDetailsEditPanel)}
        className="absolute -top-11 right-3 flex cursor-pointer items-center gap-1 text-[#0655a7] hover:opacity-75 xl:hidden"
      >
        <MdOutlineExpandCircleDown
          size={16}
          color="#0655a7"
          className={openDetailsEditPanel ? "rotate-90" : "-rotate-90"}
        />
        <p>
          <i className="text-[13px] font-[500]">{TaskString.CHI_TIET}</i>
        </p>
      </div>
      <div
        className={cn(
          "col-span-12 max-h-[calc(100vh-150px)] overflow-y-auto px-2 pb-20 pt-2 scrollbar-hide xl:col-span-7 xl:-ml-2",
          openDetailsEditPanel ? "opacity-0 xl:opacity-100" : "opacity-100"
        )}
      >
        <div className="w-full px-6 pb-[2px] pt-5 shadow-custom">
          <div className={`bg-white`}>
            <div className="mb-6 flex flex-col items-start gap-3">
              <div className="flex h-fit w-full items-center justify-between">
                <label htmlFor="" className="text-primary min-w-[75px]">
                  {TaskString.TEN_CONG_VIEC}
                  <RequireText />
                  <i className="text-[13px] text-orange-500">{TaskString.TOI_DA_150_KI_TU}</i>
                </label>
                <div className="text-[13px]">{`${title.length ?? 0}/150`}</div>
              </div>
              <input
                maxLength={150}
                value={title}
                onChange={e => setTitle(e.target.value)}
                type="text"
                className="w-full rounded-md border-2 p-2 leading-5 shadow-sm"
              />
            </div>
            <div className="text-primary mb-3 min-w-[75px]">
              {TaskString.MO_TA_CONG_VIEC} <RequireText />
            </div>
            <div className="overflow-hidden rounded-md border-2">
              <ReactQuill
                modules={quillModules}
                className="bg-white"
                theme="snow"
                value={value}
                onChange={setValue}
              />
            </div>
            <div className="min-h-fit w-full rounded-b-md bg-white pt-5">
              <p className="mb-3 mt-6 text-sm font-semibold text-orange-500">
                <span className="text-[13px] text-[#444]">{TaskString.TAI_LIEU_DINH_KEM}</span>
                <i>
                  {TaskString.WHILE_SPACE}
                  {TaskString.TAI_LIEU_DINH_KEM_100MB}
                </i>
              </p>
              <div className="mb-4 flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <CustomButton className="mb-3 shrink-0 bg-gray-200" onClick={fileHandler}>
                    <div className="flex items-center gap-2">
                      <IoMdDocument size={15} color="#555" />
                      <span className="text-secondary mt-[1px] text-[13px] normal-case">
                        {TaskString.THEM_TAI_LIEU}
                      </span>
                    </div>
                  </CustomButton>
                </div>
                {files.length > 0 && (
                  <CustomButton className="mb-3" onClick={() => setFiles([])} disablePadding>
                    <AiFillCloseCircle size={20} color="#f31f20" />
                  </CustomButton>
                )}
              </div>
              {getDocumentsFiles && getDocumentsFiles.length > 0 && (
                <>
                  <p className="text-secondary mb-6 mt-10 text-sm">
                    {TaskString.TAI_LIEU_DINH_KEM}
                  </p>
                  <FileSection
                    handleDelete={handleDeleteFile}
                    visibleType={visibleType}
                    fileList={getDocumentsFiles}
                  />
                </>
              )}
              {getImagesFiles && getImagesFiles.length > 0 && (
                <div className="mb-6">
                  <p className="text-secondary mb-6 text-sm">{TaskString.ANH_DINH_KEM}</p>
                  <ImageSection handleDelete={handleDeleteFile} imgFiles={getImagesFiles} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "absolute right-2 top-0 col-span-12 mt-2 flex h-fit flex-col bg-white px-6 py-5 shadow-custom transition-all xl:static xl:col-span-5",
          openDetailsEditPanel
            ? "left-2 opacity-100"
            : "pointer-events-none left-full opacity-0 xl:pointer-events-auto xl:opacity-100"
        )}
      >
        <div className="px-2 xl:px-0">
          <div className="grid grid-cols-2 gap-x-10 gap-y-6">
            <div className="flex flex-col items-start gap-3">
              <label htmlFor="" className="text-primary col-span-2 mr-4">
                {TaskString.KHACH_HANG}
                <RequireText />
              </label>
              <Autocomplete
                noOptionsText="Không có lựa chọn"
                id="companies"
                value={
                  currentPerson.roleType === Role.CUSTOMER
                    ? currentInfo?.company?.companyName || TaskString.TRONG
                    : selectedCompany
                }
                onChange={(_, newValue) => {
                  setSelectedCompany(newValue);
                }}
                getOptionLabel={
                  currentPerson.roleType === Role.CUSTOMER
                    ? undefined
                    : option => option.companyName
                }
                size="small"
                options={companies}
                fullWidth
                disabled={currentPerson.roleType === Role.CUSTOMER}
                renderInput={params => (
                  <TextField
                    {...params}
                    sx={{
                      "& .MuiInputBase-sizeSmall": {
                        height: "40px !important"
                      },
                      "& .MuiAutocomplete-input": { fontSize: "13px !important" }
                    }}
                    placeholder={
                      currentPerson.roleType === Role.CUSTOMER ? "" : "-- Chọn khách hàng --"
                    }
                  />
                )}
              />
            </div>
            {renderCustomerCreate()}
            <div className="flex flex-col items-start gap-3">
              <label htmlFor="" className="text-primary col-span-2 mr-4">
                {TaskString.ACCOUNT_MANAGER}
                <RequireText />
              </label>
              <Autocomplete
                disabled={
                  currentPerson.roleType === Role.ACCOUNT ||
                  currentPerson.roleType === Role.DESIGNER
                }
                noOptionsText="Không có lựa chọn"
                id="accounts"
                value={selectedAccount}
                onChange={(_, newValue) => {
                  setSelectedAccount(newValue);
                }}
                getOptionLabel={option => option.fullname}
                size="small"
                options={accounts}
                fullWidth
                // disabled
                renderInput={params => (
                  <TextField
                    {...params}
                    sx={{
                      "& .MuiInputBase-sizeSmall": {
                        height: "40px !important"
                      },
                      "& .MuiAutocomplete-input": { fontSize: "13px !important" }
                    }}
                    placeholder={
                      currentPerson.roleType === Role.ACCOUNT ? "" : "-- Chọn Account --"
                    }
                  />
                )}
              />
            </div>
            {currentPerson.roleType !== Role.CUSTOMER &&
              correlationJobType === CorrelationJobType.Job && (
                <div className="flex flex-col items-start gap-3">
                  <label htmlFor="" className="text-primary col-span-2 mr-4">
                    Designer
                    <RequireText />
                  </label>
                  <Autocomplete
                    noOptionsText="Không có lựa chọn"
                    id="designers"
                    value={selectedDesigner}
                    onChange={(_, newValue) => {
                      setSelectedDesigner(newValue);
                    }}
                    getOptionLabel={option => option.fullname}
                    size="small"
                    options={designers}
                    fullWidth
                    // disabled
                    renderInput={params => (
                      <TextField
                        {...params}
                        sx={{
                          "& .MuiInputBase-sizeSmall": {
                            height: "40px !important"
                          },
                          "& .MuiAutocomplete-input": { fontSize: "13px !important" }
                        }}
                        placeholder="-- Chọn NTK --"
                      />
                    )}
                  />
                </div>
              )}
            <div className="flex flex-col items-start gap-3">
              <label htmlFor="" className="text-primary col-span-2 mr-4">
                Loại thiết kế
                <RequireText />
              </label>
              <Autocomplete
                id="jobtypes"
                value={selectedJobType}
                onChange={(_, newValue) => {
                  if (newValue) setSelectedJobType(newValue);
                }}
                getOptionLabel={option => option.typeName}
                size="small"
                options={jobtypes}
                fullWidth
                // disabled
                renderInput={params => (
                  <TextField
                    {...params}
                    sx={{
                      "& .MuiInputBase-sizeSmall": {
                        height: "40px !important"
                      },
                      "& .MuiAutocomplete-input": { fontSize: "13px !important" }
                    }}
                    placeholder="-- Chọn loại TK --"
                  />
                )}
              />
            </div>
            <div
              className={`grid ${
                currentPerson.roleType === Role.ADMIN ||
                correlationJobType === CorrelationJobType.Job
                  ? "grid-cols-2"
                  : "grid-cols-1"
              } gap-4`}
            >
              <div className="flex flex-col items-start gap-3">
                <label htmlFor="" className="text-primary col-span-2 mr-4">
                  {TaskString.UU_TIEN}
                  <RequireText />
                </label>
                <Select
                  fullWidth
                  placeholder="Gi cung duoc"
                  size="small"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedPriority}
                  onChange={e => setSelectedPriority(e.target.value as Priority)}
                  sx={{
                    "& .MuiInputBase-inputSizeSmall": {
                      fontSize: "13px !important"
                    }
                  }}
                >
                  {priorityOptions.map(({ key, text }) => (
                    <MenuItem key={key} value={key}>
                      {text}
                    </MenuItem>
                  ))}
                </Select>
              </div>
              <div className="flex flex-col items-start gap-3">{getCorrelationJobOptions()}</div>
            </div>
            <div className="flex flex-col items-start gap-3">
              <label htmlFor="" className="text-primary col-span-2 mr-4">
                {TaskString.DEADLINE}
                <RequireText />
              </label>
              <DateTimePicker
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
                format="DD-MM-YYYY - h:mm"
                closeOnSelect={false}
                ampm={false}
                value={deadline}
                onChange={(value, context) => {
                  setDeadline(value);
                }}
              />
            </div>
            {/* <div className="flex flex-col items-start gap-3">
              <label htmlFor="" className="text-primary col-span-2 mr-4">
                {TaskString.TRANG_THAI}
                <RequireText />
              </label>
              <Select
                fullWidth
                size="small"
                id="demo-simple-select"
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value as JobStatusType)}
                sx={{
                  "& .MuiInputBase-inputSizeSmall": {
                    fontSize: "13px !important"
                  }
                }}
              >
                {statusFilterOptions.map(({ key, text }) => (
                  <MenuItem key={key} value={key}>
                    {text}
                  </MenuItem>
                ))}
              </Select>
            </div> */}
            {/* <div className="flex flex-col items-start gap-3">
              <label htmlFor="" className="text-primary col-span-2 mr-4">
                Loại công việc
              </label>
              <Select
                fullWidth
                size="small"
                id="demo-simple-select"
                value={selectedCorrelationJobType}
                onChange={e => setSelectedCorrelationJobType(e.target.value as CorrelationJobType)}
                sx={{
                  "& .MuiInputBase-inputSizeSmall": {
                    fontSize: "13px !important"
                  }
                }}
              >
                {correlationJobOptions.map(({ key, text }) => (
                  <MenuItem key={key} value={key}>
                    {text}
                  </MenuItem>
                ))}
              </Select>
            </div> */}
          </div>

          <div className="flex flex-1 items-center justify-center">
            <div className="relative mt-5 flex min-h-[100px] items-center gap-4">
              <CustomButton
                className="text-[#333]"
                sx={{
                  ":hover": {
                    opacity: 0.7,
                    backgroundColor: "rgb(229 231 235)"
                  }
                }}
                onClick={handleCancelJob}
                disabled={false}
              >
                <div className="flex items-center gap-2 px-2 text-[#333]">
                  <AiOutlineCloseCircle size={20} />
                  <p className="text-secondary text-xs font-semibold normal-case leading-7">
                    {correlationJobType === CorrelationJobType.Job
                      ? TaskString.HUY_CONG_VIEC
                      : TaskString.HUY_DU_AN}
                  </p>
                </div>
              </CustomButton>
              <CustomButton primary onClick={handlePost} disabled={shouldDisableCreate()}>
                <div className="flex items-center gap-2 px-2">
                  <IoAddCircleOutline color="white" size={20} />
                  <p className="text-secondary text-xs normal-case leading-7 text-white">
                    {correlationJobType === CorrelationJobType.Job
                      ? TaskString.TAO_CONG_VIEC
                      : TaskString.TAO_DU_AN}
                  </p>
                </div>
              </CustomButton>
              {isLoading && (
                <div className="absolute -right-[30px] top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center">
                  <CircularProgress size={20} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
