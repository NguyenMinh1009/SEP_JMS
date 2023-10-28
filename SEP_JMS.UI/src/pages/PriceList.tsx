import { KeyboardEvent, useState } from "react";
import PriceListPreview from "../components/price/priceList/PriceListPreview";
import { TextField } from "@mui/material";
import { IoCreateOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { PathString } from "../enums/MapRouteToBreadCrumb";

const PriceList = () => {
  const [value, setValue] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  const navigate = useNavigate();
  const { priceGroupId } = useParams();

  const onSearch = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.code == "Enter") {
      setSearchValue(value);
    }
  };

  return (
    <>
      <div className="mb-10 flex items-center justify-between gap-3">
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
        <div
          onClick={() => {
            navigate(`/${PathString.PRICES}/${priceGroupId}/${PathString.CHINH_SUA}`);
          }}
          className="flex h-10 cursor-pointer items-center gap-2 rounded-md bg-accent p-3 text-white hover:opacity-75"
        >
          <IoCreateOutline size={20} className="text-white" />
          <span>Chỉnh sửa nhóm giá</span>
        </div>
      </div>
      <p className="text-primary mb-6 text-base">Danh sách đơn giá</p>
      <div className="grid grid-cols-20 items-start gap-2">
        <div className="col-span-full overflow-hidden p-1 pb-20 ">
          <PriceListPreview searchValue={searchValue} />
        </div>
      </div>
    </>
  );
};

export default PriceList;
