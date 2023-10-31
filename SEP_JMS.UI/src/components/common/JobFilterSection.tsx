import { DateTimePicker, viVN } from "@mui/x-date-pickers";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { dateToTicks, getDefaultDeadline, getDefaultFilterStart } from "../../utils/Datetime";
import { Autocomplete, MenuItem, Select, TextField } from "@mui/material";
import { JobType, jobOptions } from "../../enums/jobType";
import { internalStatusOptions, statusOptions } from "./StatusSection";
import { JobStatusType } from "../../enums/jobStatusType";
import { allKey, correlationJobOptions, defaultCompany } from "../../constants";
import { CorrelationJobType } from "../../enums/correlationJobType";
import useCurrentPerson from "../../hooks/store/useCurrentPerson";
import { Role } from "../../enums/role";
import { InternalJobStatusType } from "../../enums/internalJobStatusType";
import useFilterInfo from "../../hooks/store/useFilterInfo";
import CustomButton from "./CustomButton";
import { useLocation } from "react-router-dom";
import AlwayxInstance from "../../api/AxiosInstance";
import useSnakeBar from "../../hooks/store/useSnakeBar";

interface JobFilterSectionProps {
  isInternal?: boolean;
  finishedOnly?: boolean;
  report?: boolean;
}

const JobFilterSection: React.FC<JobFilterSectionProps> = ({
  isInternal,
  finishedOnly,
  report
}) => {
  const [from, setFrom] = useState<moment.Moment | null>(null);
  const [to, setTo] = useState<moment.Moment | null>(null);
  const [selectedJobType, setSelectedJobType] = useState<{ key: JobType; text: string } | null>(
    null
  );
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
  const [companies, setCompanies] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [designers, setDesigners] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [jobtypes, setJobtypes] = useState<any[]>([]);

  const currentPerson = useCurrentPerson();
  const filterInfoController = useFilterInfo();
  const location = useLocation();
  const snakeBar = useSnakeBar();

  useEffect(() => {
    getCompanyList();
    getDesignerList();
    getAccountList();
    getJobTypeList();
  }, [currentPerson.roleType]);

  useEffect(() => {
    setSelectedCustomer(null);
    getCustomerListForStaff();
  }, [selectedCompany, currentPerson.roleType]);

  const getCompanyList = () => {
    if (currentPerson.roleType) {
      AlwayxInstance.post(
        currentPerson.roleType === Role.ADMIN ? "company/search" : "company/search",
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
    if (currentPerson.roleType) {
      AlwayxInstance.post("user/search", {
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
    if (
      !currentPerson.roleType ||
      currentPerson.roleType === Role.ACCOUNT ||
      currentPerson.roleType === Role.DESIGNER
    )
      return;
    AlwayxInstance.post("user/search", {
      pageIndex: 1,
      pageSize: 2147483647,
      searchText: null,
      role: Role.ACCOUNT
    })
      .then(res => setAccounts(res.data.items))
      .catch(err => console.error(err));
  };

  const getCustomerListForStaff = () => {
    if (currentPerson.roleType) {
      AlwayxInstance.post(
        currentPerson.roleType === Role.ADMIN ? "user/search" : "customer/related",
        {
          pageIndex: 1,
          pageSize: 2147483647,
          companyId: selectedCompany?.companyId ?? undefined,
          role: Role.CUSTOMER
        }
      )
        .then(res => setCustomers(res.data.items))
        .catch(err => console.error(err));
    }
  };

  const getJobTypeList = () => {
    AlwayxInstance.get("jobtype/all")
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
      ? filterInfoController.setContent?.({
          from: from ? dateToTicks(from.toDate()) : 0,
          to: to ? dateToTicks(to.toDate()) : null,
          jobStatus: selectedStatus === allKey.key ? undefined : selectedStatus,
          jobType: selectedJobType?.key ?? undefined,
          accountId: selectedAccount?.userId ?? undefined,
          designerId: selectedDesigner?.userId ?? undefined,
          companyId: selectedCompany?.companyId ?? undefined,
          correlationType:
            selectedCorrelationJobType === allKey.key ? undefined : selectedCorrelationJobType,
          customerId: selectedCustomer?.userId ?? undefined
        })
      : snakeBar.setSnakeBar("Tìm kiếm không hợp lệ!", "warning", true);
  };

  return (
    <div key={location.pathname} className="grid grid-cols-5 items-end gap-3">
      <div className="flex flex-col items-start gap-3">
        <label htmlFor="" className="text-primary col-span-2 mr-4">
          Từ ngày
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
          Đến ngày
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
              Loại thiết kế
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
              Trạng thái
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
              {(isInternal ? [allKey, ...internalStatusOptions] : [allKey, ...statusOptions]).map(
                ({ key, text }) => (
                  <MenuItem key={key} value={key}>
                    {text}
                  </MenuItem>
                )
              )}
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
              value={selectedCorrelationJobType}
              onChange={e => setSelectedCorrelationJobType(e.target.value as CorrelationJobType)}
              sx={{
                "& .MuiInputBase-inputSizeSmall": {
                  fontSize: "13px !important"
                }
              }}
            >
              {[allKey, ...correlationJobOptions].map(({ key, text }) => (
                <MenuItem key={key} value={key}>
                  {text}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="flex flex-col items-start gap-3">
            <label htmlFor="" className="text-primary col-span-2 mr-4">
              Khách hàng
            </label>
            <Autocomplete
              noOptionsText="Không có lựa chọn"
              id="companies"
              value={selectedCompany}
              onChange={(_, newValue) => {
                setSelectedCompany(newValue);
              }}
              getOptionLabel={option => option.companyName}
              size="small"
              options={companies}
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
                  placeholder="-- Chọn khách hàng --"
                />
              )}
            />
          </div>
          <div className="flex flex-col items-start gap-3">
            <label htmlFor="" className="text-primary col-span-2 mr-4">
              Người order
            </label>
            <Autocomplete
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
                  placeholder="-- Chọn người order --"
                />
              )}
            />
          </div>
          <div className="flex flex-col items-start gap-3">
            <label htmlFor="" className="text-primary col-span-2 mr-4">
              Designer
            </label>
            <Autocomplete
              disabled={currentPerson.roleType === Role.DESIGNER}
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
          <div className="flex flex-col items-start gap-3">
            <label htmlFor="" className="text-primary col-span-2 mr-4">
              Account
            </label>
            <Autocomplete
              disabled={
                currentPerson.roleType === Role.ACCOUNT || currentPerson.roleType === Role.DESIGNER
              }
              noOptionsText="Không có lựa chọn"
              id="designers"
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
        </>
      )}
      <CustomButton
        primary
        className="h-10 text-xs font-normal normal-case text-white"
        onClick={handleApply}
      >
        Áp dụng
      </CustomButton>
    </div>
  );
};

export default JobFilterSection;
