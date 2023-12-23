import { DateTimePicker, viVN } from "@mui/x-date-pickers";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { dateToTicks, getDefaultDeadline, getDefaultFilterStart } from "../../utils/Datetime";
import { Autocomplete, CircularProgress, MenuItem, Select, TextField } from "@mui/material";
import { JobType, jobOptions } from "../../enums/jobType";
import {
  internalStatusFilterOptions,
  internalStatusOptions,
  statusFilterOptions,
  statusOptions
} from "./StatusSection";
import { JobStatusType } from "../../enums/jobStatusType";
import { allKey, correlationJobOptions, defaultCompany } from "../../constants";
import { CorrelationJobType } from "../../enums/correlationJobType";
import useCurrentPerson from "../../hooks/store/useCurrentPerson";
import { Role } from "../../enums/Role";
import { InternalJobStatusType } from "../../enums/internalJobStatusType";
import useFilterInfo from "../../hooks/store/useFilterInfo";
import CustomButton from "./CustomButton";
import { useLocation } from "react-router-dom";
import APIClientInstance from "../../api/AxiosInstance";
import useSnakeBar from "../../hooks/store/useSnakeBar";
import { TaskString } from "../../enums/taskEnums";
import { PaymentSuccessOptions } from "../../enums/paymentSuccess";

interface JobFilterSectionProps {
  isInternal?: boolean;
  finishedOnly?: boolean;
  report?: boolean;
  quickSelect?: number;
  isCorrelationJobType: number;
}

const JobFilterSection: React.FC<JobFilterSectionProps> = ({
  isInternal,
  finishedOnly,
  report,
  quickSelect,
  isCorrelationJobType
}) => {
  const [from, setFrom] = useState<moment.Moment | null>(null);
  const [to, setTo] = useState<moment.Moment | null>(null);
  const [selectedJobType, setSelectedJobType] = useState<any | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [selectedDesigner, setSelectedDesigner] = useState<any | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<any | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<
    JobStatusType | InternalJobStatusType | typeof allKey.key
  >(finishedOnly ? JobStatusType.Completed : allKey.key);
  const [selectedCorrelationJobType, setSelectedCorrelationJobType] = useState<
    CorrelationJobType | typeof allKey.key
  >(allKey.key);
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [selectedPaymentSuccess, setSelectedPaymentSuccess] = useState<any | null>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [designers, setDesigners] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [jobtypes, setJobtypes] = useState<any[]>([]);
  // const [paymentSuccess, setPaymentSuccess] = useState<any[]>(PaymentSuccessOptions);
  const [currentInfo, setCurrentInfo] = useState<any>(null);

  const currentPerson = useCurrentPerson();
  const filterInfoController = useFilterInfo();
  const location = useLocation();
  const snakeBar = useSnakeBar();

  const [isLoading, setLoading] = useState<boolean>(false);

  // reset state when prop change
  // useEffect(() => handleApply(), [report]);
  useEffect(() => {
    if (!report || !quickSelect) return;
    let now = new Date();
    let past = structuredClone(now);
    past.setMonth(past.getMonth() - quickSelect);
    setFrom(moment(past));
    setTo(moment(now));
  }, [quickSelect]);

  useEffect(() => {
    const fetchData = async () => {
      getCompanyList();
      getDesignerList();
      getAccountList();
      getJobTypeList();
      await getCurrentInfo();
    };
    fetchData();
  }, [currentPerson.roleType]);

  useEffect(() => {
    if (currentPerson.roleType !== Role.CUSTOMER && currentPerson.roleType) {
      const fetchData = async () => {
        setSelectedCustomer(null);
        setCustomers([]);

        await getCustomerListForStaff();
        renderCustomerFilter();
      };
      fetchData();
    }
  }, [selectedCompany, currentPerson.roleType]);

  const getCompanyList = () => {
    if (currentPerson.roleType) {
      APIClientInstance.post(
        currentPerson.roleType === Role.ADMIN ? "company/search" : "company/related",
        {
          pageIndex: 1,
          pageSize: 2147483647,
          searchText: null
        }
      )
        .then(res => setCompanies(res.data.items))
        .catch(err => console.error(err));
    }
  };
  const getDesignerList = () => {
    if (currentPerson.roleType !== Role.DESIGNER) {
      APIClientInstance.post("user/search", {
        pageIndex: 1,
        pageSize: 2147483647,
        searchText: null,
        role: Role.DESIGNER
      })
        .then(res => setDesigners(res.data.items))
        .catch(err => console.error(err));
    }
  };

  const getAccountList = () => {
    if (currentPerson.roleType === Role.ACCOUNT || currentPerson.roleType === Role.DESIGNER) return;
    APIClientInstance.post("user/search", {
      pageIndex: 1,
      pageSize: 2147483647,
      searchText: null,
      role: Role.ACCOUNT
    })
      .then(res => setAccounts(res.data.items))
      .catch(err => console.error(err));
  };

  const getCustomerListForStaff = () => {
    if (currentPerson.roleType !== Role.CUSTOMER) {
      setLoading(true);
      APIClientInstance.post("customer/related", {
        pageIndex: 1,
        pageSize: 2147483647,
        companyId: selectedCompany?.companyId ?? undefined
      })
        .then(res => {
          setCustomers(res.data.items);
          setLoading(false);
        })
        .catch(err => console.error(err));
    }
  };

  const getJobTypeList = () => {
    APIClientInstance.get("jobtype/all")
      .then(res => setJobtypes(res.data))
      .catch(err => console.error(err));
  };

  const checkInputDateFilter = () => {
    let fromInput: number;
    let toInput: number;
    fromInput = from ? dateToTicks(from.toDate()) : 0;
    toInput = to ? dateToTicks(to.toDate()) : 0;

    if (fromInput && toInput !== 0 && toInput < fromInput) {
      return false;
    }

    return true;
  };

  const handleApply = () => {
    checkInputDateFilter()
      ? isInternal
        ? filterInfoController.setContent?.({
          from: from ? dateToTicks(from.toDate()) : 0,
          to: to ? dateToTicks(to.toDate()) : null,
          internalJobStatus: selectedStatus === allKey.key ? undefined : selectedStatus,
          jobType: selectedJobType?.typeId ?? undefined,
          accountId: selectedAccount?.userId ?? undefined,
          designerId: selectedDesigner?.userId ?? undefined,
          companyId: selectedCompany?.companyId ?? undefined,
          correlationType:
            selectedCorrelationJobType === allKey.key ? undefined : selectedCorrelationJobType,
          customerId: selectedCustomer?.userId ?? undefined
        })
        : filterInfoController.setContent?.({
          from: from ? dateToTicks(from.toDate()) : 0,
          to: to ? dateToTicks(to.toDate()) : null,
          jobStatus: selectedStatus === allKey.key ? undefined : selectedStatus,
          jobType: selectedJobType?.typeId ?? undefined,
          accountId: selectedAccount?.userId ?? undefined,
          designerId: selectedDesigner?.userId ?? undefined,
          companyId: selectedCompany?.companyId ?? undefined,
          correlationType:
            selectedCorrelationJobType === allKey.key ? undefined : selectedCorrelationJobType,
          customerId: selectedCustomer?.userId ?? undefined,
          paymentSuccess: selectedPaymentSuccess?.key ?? null
        })
      : snakeBar.setSnakeBar("Tìm kiếm không hợp lệ!", "warning", true);
  };

  const clearAll = () => {
    setFrom(null), setTo(null), setSelectedCompany(null);
    setSelectedCustomer(null),
      setSelectedJobType(null),
      setSelectedDesigner(null),
      setSelectedStatus(allKey.key),
      setSelectedAccount(null),
      setSelectedPaymentSuccess(null);
  };

  const getCurrentInfo = async () => {
    await APIClientInstance.get("user/profile").then(res => {
      setCurrentInfo(res.data);
    });
  };

  // const renderCompanyFilter = () => {
  //   return (

  //   );
  // };

  const renderCustomerFilter = () => {
    return (
      <div className="flex flex-col items-start gap-3">
        <label htmlFor="" className="text-primary col-span-2 mr-4">
          {TaskString.NGUOI_ORDER}
        </label>
        <Autocomplete
          loading={isLoading}
          noOptionsText="Không có lựa chọn"
          id="customers"
          value={
            currentPerson.roleType === Role.CUSTOMER
              ? `${currentInfo?.fullname} (${currentInfo?.username})` || "..."
              : selectedCustomer
          }
          onChange={(_, newValue) => {
            setSelectedCustomer(newValue);
          }}
          getOptionLabel={
            currentPerson.roleType === Role.CUSTOMER
              ? undefined
              : option => `${option.fullname} (${option.username})`
          }
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

  const renderDesignerFilter = () => {
    if (isCorrelationJobType === CorrelationJobType.Job)
      return (
        <div className="flex flex-col items-start gap-3">
          <label htmlFor="" className="text-primary col-span-2 mr-4">
            {TaskString.NGUOI_THIET_KE}
          </label>
          <Autocomplete
            disabled={currentPerson.roleType === Role.DESIGNER}
            noOptionsText="Không có lựa chọn"
            id="designers"
            value={
              currentPerson.roleType === Role.DESIGNER
                ? currentInfo?.fullname || "..."
                : selectedDesigner
            }
            onChange={(_, newValue) => {
              setSelectedDesigner(newValue);
            }}
            getOptionLabel={
              // currentPerson.roleType === Role.ACCOUNT
              currentPerson.roleType === Role.DESIGNER ? undefined : option => option.fullname
            }
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
                placeholder={currentPerson.roleType === Role.DESIGNER ? "" : "-- Chọn NTK --"}
              />
            )}
          />
        </div>
      );
  };

  const renderPaymentSuccessFilter = () => {
    if (finishedOnly) {
      return (
        <div className="flex flex-col items-start gap-3">
          <label htmlFor="" className="text-primary col-span-2 mr-4">
            {TaskString.TRANG_THAI_THANH_TOAN}
          </label>
          <Autocomplete
            noOptionsText="Không có lựa chọn"
            id="paymentSuccess"
            value={selectedPaymentSuccess}
            onChange={(_, newValue) => {
              setSelectedPaymentSuccess(newValue);
            }}
            getOptionLabel={option => option.text}
            size="small"
            options={PaymentSuccessOptions}
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
                placeholder="--Tất cả--"
              />
            )}
          />
        </div>
      );
    }
  };

  return (
    <div>
      <div key={location.pathname} className={`grid ${!report ? "grid-cols-6" : "grid-cols-5"} items-end gap-3`}>

        <div className="flex flex-col items-start gap-3">
          <label htmlFor="" className="text-primary col-span-2 mr-4">
            {TaskString.TU_NGAY}
          </label>
          <DateTimePicker
            slotProps={{
              actionBar: {
                actions: ["clear"]
              }
            }}
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
            value={from}
            onChange={value => {
              setFrom(value);
            }}
          />
        </div>
        <div className="flex flex-col items-start gap-3">
          <label htmlFor="" className="text-primary col-span-2 mr-4">
            {TaskString.DEN_NGAY}
          </label>
          <DateTimePicker
            slotProps={{
              actionBar: {
                actions: ["clear"]
              }
            }}
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
            value={to}
            onChange={value => {
              setTo(value);
            }}
          />
        </div>

        {!report && (
          <>
            <div className="flex flex-col items-start gap-3">
              <label htmlFor="" className="text-primary col-span-2 mr-4">
                {TaskString.LOAI_THIET_KE}
              </label>
              <Autocomplete
                id="types"
                value={selectedJobType}
                onChange={(_, newValue) => {
                  setSelectedJobType(newValue);
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
            <div className="flex flex-col items-start gap-3">
              <label htmlFor="" className="text-primary col-span-2 mr-4">
                {TaskString.TRANG_THAI}
              </label>
              <Select
                disabled={finishedOnly}
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
                {(finishedOnly
                  ? [allKey, ...statusOptions]
                  : isInternal
                    ? [allKey, ...internalStatusFilterOptions]
                    : [allKey, ...statusFilterOptions]
                ).map(({ key, text }) => (
                  <MenuItem key={key} value={key}>
                    {text}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="flex flex-col items-start gap-3">
              <label htmlFor="" className="text-primary col-span-2 mr-4">
                {TaskString.KHACH_HANG}
              </label>
              <Autocomplete
                noOptionsText="Không có lựa chọn"
                id="companies"
                value={
                  currentPerson.roleType === Role.CUSTOMER
                    ? currentInfo?.company?.companyName || "..."
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
            {renderCustomerFilter()}
            {renderDesignerFilter()}

            <div className="flex flex-col items-start gap-3">
              <label htmlFor="" className="text-primary col-span-2 mr-4">
                {TaskString.ACCOUNT_MANAGER}
              </label>
              <Autocomplete
                disabled={
                  currentPerson.roleType === Role.ACCOUNT ||
                  currentPerson.roleType === Role.DESIGNER
                }
                noOptionsText="Không có lựa chọn"
                id="designers"
                value={
                  currentPerson.roleType === Role.ACCOUNT
                    ? // || currentPerson.roleType === Role.DESIGNER
                    currentInfo?.fullname || "..."
                    : selectedAccount
                }
                onChange={(_, newValue) => {
                  setSelectedAccount(newValue);
                }}
                getOptionLabel={
                  currentPerson.roleType === Role.ACCOUNT
                    ? // || currentPerson.roleType === Role.DESIGNER
                    undefined
                    : option => option.fullname
                }
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
                      currentPerson.roleType === Role.ACCOUNT ? "" : "-- Chọn Account Manager --"
                    }
                  />
                )}
              />
            </div>

            {renderPaymentSuccessFilter()}
          </>
        )}

        <button
          className="flex h-10 w-full cursor-pointer justify-center gap-2 rounded-md bg-amber-600 p-3 text-white hover:opacity-75 3xl:w-auto"
          onClick={clearAll}
        >
          {TaskString.XOA_TAT_CA}
        </button>
        <CustomButton
          primary
          className="h-10 w-full items-start gap-3 text-xs font-normal normal-case text-white"
          onClick={handleApply}
        >
          {TaskString.AP_DUNG}
        </CustomButton>



      </div>
    </div>
  );
};

export default JobFilterSection;
