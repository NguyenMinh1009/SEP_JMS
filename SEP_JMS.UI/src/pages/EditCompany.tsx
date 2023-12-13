import { Autocomplete, CircularProgress, Divider, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import APIClientInstance from "../api/AxiosInstance";
import { Role } from "../enums/role";
import { UsersPreviewData } from "../interface/usersPreviewData";
import RequireText from "../components/common/RequireText";
import CustomButton from "../components/common/CustomButton";
import useSnakeBar from "../hooks/store/useSnakeBar";
import { useNavigate, useParams } from "react-router-dom";
import { PathString } from "../enums/MapRouteToBreadCrumb";
import { CompanyResponseType } from "../interface/company";
import { PriceGroup } from "../interface/price";
import useTitle from "../hooks/store/useCurrentTitle";

const EditCompany = () => {
  const [companyName, setCompanyName] = useState<string>("");
  const [companyAddress, setCompanyAddress] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [priceGroups, setPriceGroups] = useState<PriceGroup[]>([]);
  const [selectedPriceGroups, setSelectedPriceGroups] = useState<PriceGroup | null>(null);
  const [accounts, setAccounts] = useState<UsersPreviewData[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<UsersPreviewData | null>(null);
  const [isButtonLoading, setButtonLoading] = useState<boolean>(false);
  const snakeBar = useSnakeBar();
  const navigate = useNavigate();
  const companyTitle = useTitle()
  const { companyId } = useParams();

  useEffect(() => {
    void getGroupIdPrice();
    getAccounts().then(() => {
      getCompanyInfo();
    });
  }, []);

  const getAccounts = async () => {
    const accountRes = await APIClientInstance.post("admin/users/all", {
      pageIndex: 1,
      pageSize: 2147483647,
      searchText: "",
      role: Role.ACCOUNT
    });
    const accountList: UsersPreviewData[] | undefined = accountRes.data?.items;
    if (accountList) {
      setAccounts(accountList);
    }
  };

  const getGroupIdPrice = async () => {
    const priceGroupRes = await APIClientInstance.post("price/all", {});
    if (priceGroupRes.data) setPriceGroups(priceGroupRes.data.items);
  };

  const getCompanyInfo = async () => {
    try {
      const companyRes = await APIClientInstance.get(`admin/company/${companyId}`);
      const { account, company, priceGroup } = companyRes.data as CompanyResponseType;
      setCompanyName(company.companyName);
      companyTitle.setContent(company.companyName);
      setCompanyAddress(company.companyAddress);
      setDescription(company.description ?? "");
      setSelectedAccounts(account);
      setSelectedPriceGroups(priceGroup);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelJob = () => {
    navigate(`/${PathString.USERS}`);
  };

  const handleEditCompany = () => {
    setButtonLoading(true);
    APIClientInstance.put(`admin/update/company/${companyId}`, {
      companyName: companyName,
      companyAddress: companyAddress,
      description: description,
      priceGroupId: selectedPriceGroups?.priceGroupId,
      accountId: selectedAccounts?.userId
    })
      .then(() => {
        snakeBar.setSnakeBar("Chỉnh sửa công ty thành công", "success", true);
        handleCancelJob();
      })
      .catch(err => {
        snakeBar.setSnakeBar("Có lỗi xảy ra [" + err.response.data + "]", "error", true);
        setButtonLoading(false);
      });
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-6">
        <p className="text-primary text-base">Chỉnh sửa company</p>
      </div>
      <Divider />
      <div className="flex max-w-[550px] flex-col gap-4 py-6">
        {/* Tên company */}
        <div className="flex items-center">
          <div className="flex min-w-[150px] items-center">
            <label htmlFor="" className="text-secondary whitespace-nowrap">
              Tên company
            </label>
            <RequireText />
          </div>
          <input
            maxLength={150}
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            type="text"
            className="common-input-border w-full rounded-md p-2 leading-5 shadow-sm"
          />
        </div>

        {/* Địa chỉ */}
        <div className="flex items-center">
          <label htmlFor="" className="text-secondary min-w-[150px] whitespace-nowrap">
            Địa chỉ
          </label>
          <input
            maxLength={150}
            value={companyAddress}
            onChange={e => setCompanyAddress(e.target.value)}
            type="text"
            className="common-input-border w-full rounded-md p-2 leading-5 shadow-sm"
          />
        </div>

        {/* Mô tả */}
        <div className="flex items-start">
          <label htmlFor="" className="text-secondary mt-3 min-w-[150px] whitespace-nowrap">
            Mô tả ngắn
          </label>
          <textarea
            maxLength={250}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="common-input-border w-full rounded-md p-2 leading-5 shadow-sm"
          />
        </div>

        {/* Account */}
        <div className="flex items-start">
          <div className="flex min-w-[150px] items-center">
            <label htmlFor="" className="text-secondary mt-3 whitespace-nowrap">
              Account
            </label>
            <RequireText />
          </div>
          <Autocomplete
            noOptionsText="Không có lựa chọn"
            id="companies"
            value={selectedAccounts}
            onChange={(_, newValue) => {
              if (newValue) setSelectedAccounts(newValue);
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
                  maxWidth: "400px",
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

        {/* Nhóm giá */}
        <div className="flex items-start">
          <div className="flex min-w-[150px] items-center">
            <label htmlFor="" className="text-secondary mt-3 whitespace-nowrap">
              Nhóm giá
            </label>
            <RequireText />
          </div>
          <Autocomplete
            noOptionsText="Không có lựa chọn"
            id="companies"
            value={selectedPriceGroups}
            onChange={(_, newValue) => {
              if (newValue) setSelectedPriceGroups(newValue);
            }}
            getOptionLabel={option => option.name}
            size="small"
            options={priceGroups}
            fullWidth
            // disabled
            renderInput={params => (
              <TextField
                {...params}
                sx={{
                  maxWidth: "400px",
                  "& .MuiInputBase-sizeSmall": {
                    height: "40px !important"
                  },
                  "& .MuiAutocomplete-input": { fontSize: "13px !important" }
                }}
                placeholder="-- Chọn nhóm giá --"
              />
            )}
          />
        </div>
      </div>
      {/* <Divider /> */}
      <div className="flex max-w-[550px] items-center justify-end gap-4 py-4">
        <CustomButton onClick={handleCancelJob} className="font-[500] normal-case text-gray-500">
          Trở lại
        </CustomButton>
        <CustomButton
          onClick={handleEditCompany}
          disabled={!companyName || !selectedAccounts || !selectedPriceGroups}
          primary
          className="px-3 font-[400] normal-case text-white"
        >
          Chỉnh sửa company
        </CustomButton>
        {isButtonLoading && <CircularProgress size={20} />}
      </div>
    </div>
  );
};

export default EditCompany;
