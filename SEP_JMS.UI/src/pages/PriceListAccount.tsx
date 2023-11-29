import { KeyboardEvent, useEffect, useState } from "react";
import PriceListPreview from "../components/price/priceList/PriceListPreview";
import { CircularProgress, MenuItem, Select, TextField } from "@mui/material";
import { IoCreateOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { PathString } from "../enums/MapRouteToBreadCrumb";
import PriceListPreviewAccount from "../components/price/priceList/PriceListPreviewAccount";
import APIClientInstance from "../api/AxiosInstance";

const PriceListAccount = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedCompany, setCompany] = useState<string>("");
  const [companies, setCompanies] = useState<any[]>();
  const [oResult, setOResult] = useState<any[]>();
  const [pricesL, setPrices] = useState<any[]>();

  const onSearch = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.code == "Enter") {
      setSearchValue(value);
    }
  };

  const getPriceLists = async () => {
    setLoading(true);
    await APIClientInstance.post(`price/view`)
      .then(res => {
        
        const comps = res.data.map((e: any) => e.item2);
        setCompanies(comps);
        setOResult(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getPriceLists();
  }, []);

  useEffect(() => {
    setCompany(companies ? companies[0].companyId : "");
  }, [companies]);

  useEffect(()=>{
    const pr = oResult?.find(e => e.item1 == selectedCompany)?.item3;
    setPrices(pr);
  }, [selectedCompany]);

  return !isLoading ? (
    <>

      <div className="mb-10 flex items-center justify-between">
        <div className="gp-4 grid flex-1 grid-cols-3 xl:grid-cols-4">
          <div className="flex items-start gap-3">
            <Select
              fullWidth
              size="small"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedCompany}
              onChange={e => setCompany(e.target.value)}
              sx={{
                maxWidth: "180px",
                "& .MuiInputBase-inputSizeSmall": {
                  fontSize: "13px !important"
                }
              }}
            >
              {companies?.map(({ companyId, companyName }) => (
                <MenuItem key={companyId} value={companyId}>
                  {companyName}
                </MenuItem>
              ))}

            </Select>
            <TextField
              type="text"
              key="search-price"
              placeholder="Tìm loại giá..."
              size="small"
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyDown={onSearch}
              sx={{
                height: "40px",
                maxWidth: "180px",
                "& .MuiInputBase-inputSizeSmall": {
                  fontSize: "13px !important"
                }
              }}
            />
          </div>
        </div>

      </div>

      <p className="text-primary mb-6 text-base">Danh sách đơn giá</p>
      <div className="grid grid-cols-20 items-start gap-2">
        <div className="col-span-full overflow-hidden p-1 pb-20 ">
          <PriceListPreviewAccount searchValue={searchValue} prices={pricesL}/>
        </div>
      </div>
    </>
  ) : (
    <CircularProgress size={25} />
  );
};
export default PriceListAccount;
