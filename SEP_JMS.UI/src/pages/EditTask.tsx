import React, { useEffect, useState } from "react";
import sanitize from "sanitize-html";
import CustomButton from "../components/common/CustomButton";
import { IoMdDocument } from "react-icons/io";
import { IoCreateOutline } from "react-icons/io5";
import { AiOutlineCloseCircle, AiFillCloseCircle } from "react-icons/ai";
import ReactQuill, { Quill } from "react-quill";
//@ts-ignore
import quillEmoji from "quill-emoji";
import "quill-emoji/dist/quill-emoji.css";

import ImageSection from "../components/common/ImageSection";
import FileSection from "../components/FileSection";
import useCurrentPerson from "../hooks/store/useCurrentPerson";
import AlwayxInstance from "../api/AxiosInstance";
import { dateToTicks, ticksToDate } from "../utils/Datetime";
import useSnakeBar from "../hooks/store/useSnakeBar";
import { jobOptions, JobType } from "../enums/jobType";
import { Priority, priorityOptions } from "../enums/priority";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { Role } from "../enums/role";
import { VisibleType } from "../enums/visibleType";
import { Autocomplete, MenuItem, Select, TextField, Tooltip } from "@mui/material";
import { statusOptions } from "../components/common/StatusSection";
import { JobStatusType } from "../enums/jobStatusType";
import RequireText from "../components/common/RequireText";
import useTitle from "../hooks/store/useCurrentTitle";
import mime from "mime";
import moment from "moment";
import { PostType } from "../enums/postType";
import { PathString } from "../enums/MapRouteToBreadCrumb";
import { MdOutlineExpandCircleDown } from "react-icons/md";
import { DateTimePicker, viVN } from "@mui/x-date-pickers";
import { cn } from "../utils/className";
import { allowFileTypes, correlationJobOptions } from "../constants";
import { FileResponse } from "../interface/fileResponse";
import { CorrelationJobType } from "../enums/correlationJobType";
import { AxiosRequestConfig } from "axios";

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

interface ICreateTaskProp {}

const getDeadline = (date?: Date): Date => {
  if (date) return date;
  const curr = new Date();
  curr.setDate(curr.getDate() + 7);
  return curr;
};

const EditTask: React.FC<ICreateTaskProp> = () => {
  const [taskDetail, setTaskDetail] = useState<any>();
  const [value, setValue] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [oldFilesFromApi, setOldFilesFromApi] = useState<FileResponse[]>([]);
  const [initRequirementToFiles, setInitRequirementFiles] = useState<File[]>([]);
  const [finalFilesFromAPI, setFinalFilesFromAPI] = useState<FileResponse[]>([]);
  const [finalFiles, setFinalFiles] = useState<File[]>([]);
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const [previewFilesFromAPI, setPreviewFilesFromAPI] = useState<FileResponse[]>([]);
  const [title, setTitle] = useState<string>("");
  const [selectedJobType, setSelectedJobType] = useState<{ key: JobType; text: string }>(
    jobOptions[0]
  );
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [selectedDesigner, setSelectedDesigner] = useState<any | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<any | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [deadline, setDeadline] = useState<moment.Moment | null>(moment(getDeadline()));
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedPriority, setSelectedPriority] = useState<Priority>(Priority.MEDIUM);
  const [selectedStatus, setSelectedStatus] = useState<JobStatusType>(JobStatusType.NotDo);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isButtonLoading, setButtonLoading] = useState<boolean>(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [designers, setDesigners] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [openDetailsEditPanel, setOpenDetailsEditPanel] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadFinalProgress, setUploadFinalProgress] = useState<number>(0);
  const [correlationType, setCorrelationType] = useState<CorrelationJobType>(
    CorrelationJobType.Job
  );

  const navigate = useNavigate();
  const location = useLocation();

  const currentPerson = useCurrentPerson();
  const snakeBar = useSnakeBar();

  const titleBreadCrumb = useTitle();

  const { taskId } = useParams();

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

  const finalFileHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", allowFileTypes);
    input.setAttribute("multiple", "");
    input.click();
    input.onchange = (e: any) => {
      const fileList = Array.from(input.files ?? []);
      setFinalFiles(prev => [...prev, ...fileList]);
    };
  };

  const previewFileHandler = () => {
    if (previewFilesFromAPI?.length > 0 || previewFiles?.length > 0) {
      snakeBar.setSnakeBar("Tối đa 1 file ảnh preview!", "warning", true);
      return;
    }
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", allowFileTypes);
    input.click();
    input.onchange = (e: any) => {
      const fileList = Array.from(input.files ?? []);
      setPreviewFiles(prev => [...prev, ...fileList]);
    };
  };

  const requirementConfig: AxiosRequestConfig = {
    onUploadProgress: progressEvent => {
      if (progressEvent.total !== null && progressEvent.total !== undefined) {
        const progressPercentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(Math.ceil(progressPercentage / 3));
      }
    }
  };

  const finalFileConfig: AxiosRequestConfig = {
    onUploadProgress: progressEvent => {
      if (progressEvent.total !== null && progressEvent.total !== undefined) {
        const progressPercentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadFinalProgress(Math.ceil(progressPercentage / 3));
      }
    }
  };

  const previewFileConfig: AxiosRequestConfig = {
    onUploadProgress: progressEvent => {
      if (progressEvent.total !== null && progressEvent.total !== undefined) {
        const progressPercentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadFinalProgress(Math.ceil(progressPercentage / 3));
      }
    }
  };

  const getImagesFiles = React.useMemo(() => {
    return [...initRequirementToFiles, ...files].filter(file =>
      mime.getType(file.name)?.includes("image")
    );
  }, [files, initRequirementToFiles]);

  const getDocumentsFiles = React.useMemo(() => {
    return [...initRequirementToFiles, ...files].filter(
      file => !mime.getType(file.name)?.includes("image") && allowFileTypes.includes(file.type)
    );
  }, [files, initRequirementToFiles]);

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

  const getCustomerListForAdmin = () => {
    AlwayxInstance.post("customer/find", {
      pageIndex: 1,
      pageSize: 2147483647,
      searchText: null
    })
      .then(res => setCustomers(res.data.items))
      .catch(err => console.error(err));
  };

  const getDesignerList = () => {
    AlwayxInstance.post("employee/designer/all", {
      pageIndex: 1,
      pageSize: 2147483647,
      searchText: null
    })
      .then(res => setDesigners(res.data.items))
      .catch(err => console.error(err));
  };

  const getAccountList = () => {
    if (!currentPerson.roleType || currentPerson.roleType === Role.DESIGNER) return;
    AlwayxInstance.post("employee/account/all", {
      pageIndex: 1,
      pageSize: 2147483647,
      searchText: null
    })
      .then(res => setAccounts(res.data.items))
      .catch(err => console.error(err));
  };

  const getOrderList = () => {
    AlwayxInstance.post("company/all", {
      pageIndex: 1,
      pageSize: 2147483647,
      searchText: ""
    })
      .then(res => setCompanies(res.data.items))
      .catch(err => console.error(err));
  };

  const getCorrelationJobOptions = () => {
    return (
      <>
        <label htmlFor="" className="text-primary col-span-2">
          Số lượng
        </label>
        <input
          disabled={currentPerson.roleType === Role.DESIGNER}
          type="number"
          value={quantity}
          min={0}
          onChange={e => setQuantity(Number(e.target.value))}
          className="w-full rounded-md border-2 p-2 leading-5 shadow-sm"
        />
      </>
    );
  };

  //// const getCustomerId = () => {
  //   return currentPerson.roleType !== Role.CUSTOMER
  //     ? selectedCustomer?.userId
  //     : currentPerson.userId;
  // };

  //// const getAccountId = () => {
  //   if (currentPerson.roleType === Role.ADMIN)
  //     return customers.find(item => item.userId === selectedCustomer?.userId)?.account?.userId;
  //   else if (currentPerson.roleType === Role.ACCOUNT) return currentPerson?.userId;
  //   else return currentPerson?.account?.userId;
  // };

  const editBasicInfoPromise = () => {
    return currentPerson.roleType !== Role.DESIGNER
      ? AlwayxInstance.put(`job/${taskId}`, {
          title: title,
          description: getSanitizeText(value),
          designerId: selectedDesigner?.userId,
          accountId: selectedAccount?.userId,
          quantity: quantity,
          jobType: selectedJobType.key,
          deadline: dateToTicks(deadline ? deadline.toDate() : new Date()),
          priority: selectedPriority,
          jobStatus: selectedStatus,
          correlationType: correlationType
        })
      : Promise.resolve(null);
  };

  const editRequirementsPromise = () => {
    if (currentPerson.roleType !== Role.DESIGNER) {
      const editRequirementsFormData = new FormData();
      const oldFiles = oldFilesFromApi.filter(oldFile =>
        initRequirementToFiles.some(init => init.name === oldFile.originalName)
      );
      editRequirementsFormData.append("oldFiles", JSON.stringify(oldFiles));
      files.forEach(file => {
        editRequirementsFormData.append("files", file);
      });
      return AlwayxInstance.post(
        `job/${taskId}/requirement`,
        editRequirementsFormData,
        requirementConfig
      );
    }
    return Promise.resolve(null);
  };

  const editFinalFilePromise = () => {
    if (currentPerson.roleType !== Role.CUSTOMER) {
      const formData = new FormData();
      finalFiles.forEach(item => formData.append("files", item));
      formData.append("oldFiles", JSON.stringify(finalFilesFromAPI));
      return AlwayxInstance.post(`job/${taskId}/final`, formData, finalFileConfig);
    }
    return Promise.resolve(null);
  };

  const editPreviewFilePromise = () => {
    if (currentPerson.roleType !== Role.CUSTOMER) {
      const formData = new FormData();
      previewFiles.forEach(item => formData.append("files", item));
      formData.append("oldFiles", JSON.stringify(previewFilesFromAPI));
      return AlwayxInstance.post(`job/${taskId}/preview`, formData, previewFileConfig);
    }
    return Promise.resolve(null);
  };

  const editStatusForDesignerPromise = () => {
    if (currentPerson.roleType === Role.DESIGNER)
      return AlwayxInstance.put(`job/designer/${taskId}`, {
        jobStatus: selectedStatus
      });
    return Promise.resolve(null);
  };

  const handleEdit = () => {
    const totalSizeInBytes = files.reduce((total, file) => total + file.size, 0);
    if (totalSizeInBytes / (1024 * 1024) > 100) {
      snakeBar.setSnakeBar("Tổng file vượt quá 100MB!", "warning", true);
      return;
    }
    const totalFinalSizeInBytes = finalFiles.reduce((total, file) => total + file.size, 0);
    if (totalFinalSizeInBytes / (1024 * 1024) > 100) {
      snakeBar.setSnakeBar("Tổng file vượt quá 100MB!", "warning", true);
      return;
    }
    setButtonLoading(true);
    Promise.all([
      editBasicInfoPromise(),
      editRequirementsPromise(),
      editFinalFilePromise(),
      editStatusForDesignerPromise(),
      editPreviewFilePromise()
    ])
      .then(() => {
        navigate(`/${PathString.CONG_KHAI}/${taskId}`);
      })
      .catch(err => {
        console.error(err);
        snakeBar.setSnakeBar("Có lỗi xảy ra!", "error", true);
      })
      .finally(() => setButtonLoading(false));
  };

  const handleCancelJob = () => {
    navigate(location.pathname.replace(`/${PathString.CHINH_SUA}`, ""));
  };

  const getTaskDetails = async () => {
    setLoading(true);
    const res = await AlwayxInstance.get(`job/${taskId}`);
    setTaskDetail(res.data);
    titleBreadCrumb.setContent(res.data.title);
    const requirementList: FileResponse[] = res.data?.requirements?.files;
    setOldFilesFromApi(requirementList ?? []);
    if (requirementList && requirementList.length > 0) {
      for (const requirement of requirementList) {
        const response = await AlwayxInstance.post(
          `file/job/${taskId}`,
          {
            fileName: requirement.fileName,
            postsType: PostType.post
          },
          { responseType: "blob" }
        );
        const newFile = new File([response.data], requirement.originalName, {
          type: response.data.type
        });
        setInitRequirementFiles(prev => [...prev, newFile]);
      }
    }
    setFinalFilesFromAPI(res.data.finalProducts?.files ?? []);
    setPreviewFilesFromAPI(res.data.previewProducts?.files ?? []);
    setTitle(res.data.title);
    setValue(res.data.description);
    setSelectedCompany(res.data.company);
    setSelectedCustomer(res.data.customer);
    setQuantity(res.data.quantity);
    setSelectedJobType({
      key: res.data.jobType,
      text: jobOptions.find(({ key }) => key === res.data.jobType)?.text ?? ""
    });
    setSelectedPriority(res.data.priority);
    setDeadline(moment(getDeadline(ticksToDate(res.data.deadline))));
    setSelectedDesigner(res.data.designer);
    setSelectedAccount(res.data.account);
    setSelectedStatus(res.data.jobStatus);
    setCorrelationType(res.data.correlationType);
    setLoading(false);
  };

  const handleDeleteFile = (name: string) => {
    const clone = [...initRequirementToFiles];
    const deleteFileIndex = clone.findIndex(file => file.name === name);
    if (deleteFileIndex > -1) clone.splice(deleteFileIndex, 1);
    setInitRequirementFiles(clone);
  };

  const handleDeleteFinalFile = (name: string) => {
    const clone = [...finalFiles];
    const deleteFileIndex = clone.findIndex(file => file.name === name);
    if (deleteFileIndex > -1) clone.splice(deleteFileIndex, 1);
    setFinalFiles(clone);
  };

  const handleDeletePreviewFile = (name: string) => {
    const clone = [...previewFiles];
    const deleteFileIndex = clone.findIndex(file => file.name === name);
    if (deleteFileIndex > -1) clone.splice(deleteFileIndex, 1);
    setPreviewFiles(clone);
  };

  const handleDeleteFinalFileAPI = (name: string) => {
    const clone = [...finalFilesFromAPI];
    const deleteFileIndex = clone.findIndex(file => file.fileName === name);
    if (deleteFileIndex > -1) clone.splice(deleteFileIndex, 1);
    setFinalFilesFromAPI(clone);
  };

  const handleDeletePreviewFileAPI = (name: string) => {
    const clone = [...previewFilesFromAPI];
    const deleteFileIndex = clone.findIndex(file => file.fileName === name);
    if (deleteFileIndex > -1) clone.splice(deleteFileIndex, 1);
    setPreviewFilesFromAPI(clone);
  };

  const renderButtonProgressText = (): string => {
    if (!isButtonLoading) return "Lưu chỉnh sửa";
    else {
      const totalProgress = uploadProgress + uploadFinalProgress;
      if (finalFilesFromAPI?.length >= 0 || finalFiles?.length > 0) {
        if (totalProgress < 100 && totalProgress > 0) return `Đang tải lên ${totalProgress}%`;
        return "Đang xử lý ảnh";
      }
      return "Đang xử lý ảnh";
    }
  };

  useEffect(() => {
    if (currentPerson.roleType !== undefined) {
      if (currentPerson.roleType !== Role.CUSTOMER && currentPerson.roleType !== Role.DESIGNER) {
        getCustomerListForAdmin();
        getDesignerList();
        getOrderList();
        getAccountList();
      }
      getTaskDetails();
    }
    if (currentPerson.roleType === Role.CUSTOMER) {
      setSelectedAccount(currentPerson.account);
    }
  }, [currentPerson.roleType]);

  return isLoading ? (
    <CircularProgress size={20} />
  ) : (
    <>
      <p className="text-primary mb-6 text-lg">Chỉnh sửa công việc hàng ngày</p>
      <div className="relative -mx-2 -mt-2 grid h-max grid-cols-12 gap-6 px-2 ">
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
            <i className="text-[13px] font-[500]">Chi tiết</i>
          </p>
        </div>
        <div
          className={cn(
            "col-span-12 max-h-[calc(100vh-150px)] overflow-y-auto px-2 pb-20 pt-2 scrollbar-hide xl:col-span-7 xl:-ml-2",
            openDetailsEditPanel ? "opacity-0 xl:opacity-100" : "opacity-100"
          )}
        >
          <div className="w-full px-6 pb-[18px] pt-5 shadow-custom">
            <div className={`bg-white`}>
              <div className="mb-6 flex flex-col items-start gap-3">
                <div className="flex w-full items-center justify-between">
                  <label htmlFor="" className="text-primary min-w-[75px]">
                    Tên công việc
                    <i className="text-[13px] text-orange-500"> (Tối đa 150 kí tự)</i>
                  </label>
                  <div className="text-[13px]">{`${title.length ?? 0}/150`}</div>
                </div>
                <input
                  maxLength={150}
                  disabled={currentPerson.roleType === Role.DESIGNER}
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  type="text"
                  className="w-full rounded-md border-2 p-2 leading-5 shadow-sm"
                />
              </div>
              <div className="text-primary mb-3 min-w-[75px]">Mô tả công việc</div>
              <div className="mb-6 overflow-hidden rounded-md border-2">
                <ReactQuill
                  readOnly={currentPerson.roleType === Role.DESIGNER}
                  modules={quillModules}
                  className="bg-white"
                  theme="snow"
                  value={value}
                  onChange={setValue}
                />
              </div>
              <div className="min-h-fit w-full rounded-b-md bg-white">
                {currentPerson.roleType !== Role.DESIGNER && (
                  <>
                    <p className="mb-3 text-sm font-semibold text-orange-500">
                      <span className="text-[13px] text-[#444]">File đính kèm </span>
                      <i>
                        (File đính kèm dung lượng tổng 100MB, lớn hơn vui lòng gửi link drive ở phần
                        mô tả)
                      </i>
                    </p>
                    <div className="mb-4 flex w-full items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CustomButton className="mb-3 shrink-0 bg-gray-200" onClick={fileHandler}>
                          <div className="flex items-center gap-2">
                            <IoMdDocument size={15} color="#555" />
                            <span className="text-secondary mt-[1px] text-[13px] normal-case">
                              Thêm file
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
                  </>
                )}
                {getDocumentsFiles && getDocumentsFiles.length > 0 && (
                  <>
                    <p className="text-secondary mb-6 mt-10 text-sm">Tài liệu đính kèm</p>
                    <FileSection
                      handleDelete={handleDeleteFile}
                      visibleType={VisibleType.Public}
                      fileList={getDocumentsFiles}
                    />
                  </>
                )}
                {getImagesFiles && getImagesFiles.length > 0 && (
                  <div className="mb-16">
                    <p className="text-secondary mb-6 text-sm">Ảnh đính kèm</p>
                    <ImageSection handleDelete={handleDeleteFile} imgFiles={getImagesFiles} />
                  </div>
                )}
              </div>
              {currentPerson.roleType !== Role.CUSTOMER && (
                <>
                  {/* Final */}
                  <p className="mb-3 text-sm font-semibold text-orange-500">
                    <span className="text-[13px] text-[#444]">File Final </span>
                    <i>
                      (File đính kèm dung lượng tổng 100MB, lớn hơn vui lòng gửi link drive ở phần
                      mô tả)
                    </i>
                  </p>
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CustomButton
                        className="mb-3 shrink-0 bg-gray-200"
                        onClick={finalFileHandler}
                      >
                        <div className="flex items-center gap-2">
                          <IoMdDocument size={15} color="#555" />
                          <span className="text-secondary mt-[1px] text-[13px] normal-case">
                            Thêm file
                          </span>
                        </div>
                      </CustomButton>
                    </div>
                    {finalFiles &&
                      finalFilesFromAPI &&
                      finalFiles.length + finalFilesFromAPI.length > 0 && (
                        <CustomButton
                          className="mb-3"
                          onClick={() => {
                            setFinalFiles?.([]);
                            setFinalFilesFromAPI([]);
                          }}
                          disablePadding
                        >
                          <AiFillCloseCircle size={20} color="#f31f20" />
                        </CustomButton>
                      )}
                  </div>
                  {finalFilesFromAPI && finalFilesFromAPI.length > 0 && (
                    <p className="text-secondary mb-2 text-[13px]">File final cũ</p>
                  )}
                  <FileSection
                    visibleType={VisibleType.Public}
                    remoteFileList={finalFilesFromAPI?.map(file => ({
                      name: file.fileName,
                      originalName: file.originalName
                    }))}
                    handleDelete={handleDeleteFinalFileAPI}
                  />
                  {finalFiles && finalFiles.length > 0 && (
                    <p className="text-secondary mb-2 text-[13px]">File final mới</p>
                  )}
                  <FileSection
                    visibleType={VisibleType.Public}
                    fileList={finalFiles}
                    handleDelete={handleDeleteFinalFile}
                  />

                  {/* Preview */}
                  <p className="mb-3 mt-16 text-sm font-semibold text-orange-500">
                    <span className="text-[13px] text-[#444]">Ảnh báo cáo </span>
                    <i>
                      (Để chỉnh trạng thái dã xong, cần tải lên một file ảnh preview tối đa 5MB!)
                    </i>
                  </p>
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CustomButton
                        className="mb-3 shrink-0 bg-gray-200"
                        onClick={previewFileHandler}
                      >
                        <div className="flex items-center gap-2">
                          <IoMdDocument size={15} color="#555" />
                          <span className="text-secondary mt-[1px] text-[13px] normal-case">
                            Thêm file
                          </span>
                        </div>
                      </CustomButton>
                    </div>
                    {previewFiles &&
                      previewFilesFromAPI &&
                      previewFiles.length + previewFilesFromAPI.length > 0 && (
                        <CustomButton
                          className="mb-3"
                          onClick={() => {
                            setPreviewFiles?.([]);
                            setPreviewFilesFromAPI([]);
                          }}
                          disablePadding
                        >
                          <AiFillCloseCircle size={20} color="#f31f20" />
                        </CustomButton>
                      )}
                  </div>
                  {previewFilesFromAPI && previewFilesFromAPI.length > 0 && (
                    <p className="text-secondary mb-2 text-[13px]">Ảnh báo cáo cũ</p>
                  )}
                  <FileSection
                    visibleType={VisibleType.Public}
                    remoteFileList={previewFilesFromAPI?.map(file => ({
                      name: file.fileName,
                      originalName: file.originalName
                    }))}
                    handleDelete={handleDeletePreviewFileAPI}
                  />
                  {previewFiles && previewFiles.length > 0 && (
                    <p className="text-secondary mb-2 text-[13px]">Ảnh báo cáo mới</p>
                  )}
                  <FileSection
                    visibleType={VisibleType.Public}
                    fileList={previewFiles}
                    handleDelete={handleDeletePreviewFile}
                  />
                </>
              )}
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
          <div className="grid grid-cols-2 gap-x-10 gap-y-6">
            <div className="flex flex-col items-start gap-3">
              <label htmlFor="" className="text-primary col-span-2 mr-4">
                Khách hàng
              </label>
              {currentPerson.roleType === Role.DESIGNER ? (
                <div className="flex h-10 w-full items-center justify-start rounded-[4px] border-[1px] border-[#0000003b] px-3">
                  <span className="col-span-3 p-2 pl-0 opacity-60">
                    {taskDetail?.company?.companyName ?? "..."}
                  </span>
                </div>
              ) : (
                <Autocomplete
                  disabled
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
                  // disabled
                  renderInput={params => <TextField {...params} placeholder="..." />}
                />
              )}
            </div>
            <div className="flex flex-col items-start gap-3">
              <label htmlFor="" className="text-primary col-span-2 mr-4">
                Người order
                <RequireText />
              </label>
              <Autocomplete
                disabled
                noOptionsText="Không có lựa chọn"
                id="customers"
                value={selectedCustomer}
                onChange={(_, newValue) => {
                  setSelectedCustomer(newValue);
                }}
                getOptionLabel={option => option.fullname}
                size="small"
                options={customers}
                fullWidth
                // disabled
                renderInput={params => (
                  <TextField {...params} placeholder="-- Chọn người order --" />
                )}
              />
            </div>
            {/* <div className="flex flex-col items-start gap-3">
              <label htmlFor="" className="text-primary col-span-2 mr-4">
                Account
              </label>
              <div className="flex h-10 w-full items-center justify-start rounded-[4px] border-[1px] border-[#0000003b] px-3">
                {currentPerson.roleType === Role.ADMIN && (
                  <span className="col-span-3 p-2 pl-0 opacity-60">
                    {
                      customers.find(item => item.userId === selectedCustomer?.userId)?.account
                        ?.fullname
                    }
                  </span>
                )}

                {currentPerson.roleType === Role.ACCOUNT && (
                  <span className="col-span-3 p-2 pl-0 opacity-60">{currentPerson?.fullname}</span>
                )}

                {currentPerson.roleType === Role.DESIGNER && (
                  <span className="col-span-3 p-2 pl-0 opacity-60">
                    {taskDetail?.account?.fullname}
                  </span>
                )}

                {currentPerson.roleType === Role.CUSTOMER && (
                  <span className="col-span-3 p-2 pl-0 opacity-60">
                    {currentPerson?.account?.fullname}
                  </span>
                )}
              </div>
            </div> */}

            <div className="flex flex-col items-start gap-3">
              <label htmlFor="" className="text-primary col-span-2 mr-4">
                Account
              </label>
              <Autocomplete
                disabled={currentPerson.roleType === Role.CUSTOMER}
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
                    placeholder="-- Chọn Account --"
                  />
                )}
              />
            </div>

            {currentPerson.roleType !== Role.CUSTOMER && (
              <div className="flex flex-col items-start gap-3">
                <label htmlFor="" className="text-primary col-span-2 mr-4">
                  Designer
                </label>
                {currentPerson.roleType === Role.DESIGNER ? (
                  <div className="flex h-10 w-full items-center justify-start rounded-[4px] border-[1px] border-[#0000003b] px-3">
                    <span className="col-span-3 p-2 pl-0 opacity-60">
                      {taskDetail?.designer?.fullname}
                    </span>
                  </div>
                ) : (
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
                    renderInput={params => <TextField {...params} placeholder="-- Chọn NTK --" />}
                  />
                )}
              </div>
            )}

            <div className="flex flex-col items-start gap-3">
              <label htmlFor="" className="text-primary col-span-2 mr-4">
                Loại thiết kế
              </label>
              <Autocomplete
                disabled={currentPerson.roleType === Role.DESIGNER}
                id="types"
                value={selectedJobType}
                onChange={(_, newValue) => {
                  if (newValue) setSelectedJobType(newValue);
                }}
                getOptionLabel={option => option.text}
                size="small"
                options={jobOptions}
                fullWidth
                // disabled
                renderInput={params => <TextField {...params} placeholder="-- Chọn loại --" />}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-start gap-3">
                <label htmlFor="" className="text-primary col-span-2 mr-4">
                  Ưu tiên
                </label>
                <Select
                  disabled={currentPerson.roleType === Role.DESIGNER}
                  fullWidth
                  placeholder="Gi cung duoc"
                  size="small"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedPriority}
                  onChange={e => setSelectedPriority(e.target.value as Priority)}
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
                Deadline
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
                onChange={value => {
                  setDeadline(value);
                }}
              />
            </div>
            <div className="flex flex-col items-start gap-3">
              <label htmlFor="" className="text-primary col-span-2 mr-4">
                Trạng thái{" "}
                {currentPerson.roleType !== Role.CUSTOMER && (
                  <span className="mb-3 text-[13px] font-semibold text-orange-500">
                    <i>(Công khai)</i>
                  </span>
                )}
              </label>
              <Select
                disabled={
                  currentPerson.roleType === Role.DESIGNER ||
                  (currentPerson.roleType !== Role.ADMIN &&
                    selectedStatus === JobStatusType.Completed)
                }
                fullWidth
                size="small"
                id="demo-simple-select"
                value={selectedStatus}
                onChange={e => setSelectedStatus(Number(e.target.value))}
              >
                {statusOptions.map(({ key, text }) => (
                  <MenuItem
                    key={key}
                    disabled={
                      key === JobStatusType.Completed &&
                      (previewFiles?.length + previewFilesFromAPI?.length < 1 ||
                        currentPerson.roleType === Role.CUSTOMER)
                    }
                    value={key}
                    title={
                      key === JobStatusType.Completed &&
                      previewFiles?.length + previewFilesFromAPI?.length < 1
                        ? "Cần có ảnh preview!"
                        : ""
                    }
                  >
                    {text}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="flex flex-col items-start gap-3">
              <label htmlFor="" className="text-primary col-span-2 mr-4">
                Loại công việc
              </label>
              <Select
                fullWidth
                size="small"
                id="demo-simple-select"
                value={correlationType}
                onChange={e => setCorrelationType(Number(e.target.value))}
              >
                {correlationJobOptions.map(({ key, text }) => (
                  <MenuItem key={key} value={key}>
                    {text}
                  </MenuItem>
                ))}
              </Select>
            </div>
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
                    Hủy chỉnh sửa
                  </p>
                </div>
              </CustomButton>
              <CustomButton
                primary
                onClick={handleEdit}
                disabled={
                  !(
                    getSanitizeText(value).trim() !== "" &&
                    getSanitizeText(value).trim() !== "<p></p>"
                  ) ||
                  isButtonLoading ||
                  title.trim() === "" ||
                  !selectedCustomer ||
                  !selectedAccount
                }
              >
                <div className="flex items-center gap-2 px-2">
                  {!isButtonLoading && <IoCreateOutline color="white" size={20} />}
                  <p
                    className={cn(
                      "text-secondary text-xs normal-case leading-7 text-white",
                      isButtonLoading && uploadProgress === 100 ? "breath" : ""
                    )}
                  >
                    {renderButtonProgressText()}
                  </p>
                </div>
              </CustomButton>
              {isButtonLoading && (
                <div className="absolute -right-[30px] top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center">
                  <CircularProgress size={20} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditTask;