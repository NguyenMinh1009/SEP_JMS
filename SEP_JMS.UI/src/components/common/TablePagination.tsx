import React from "react";
import { Pagination, PaginationItem } from "@mui/material";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";

interface IPaginationProps {
  pageCount: number;
  page: number;
  handleChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}

const TablePagination: React.FC<IPaginationProps> = ({ pageCount, page, handleChange }) => {
  const renderRightPagingButton = (props: any) => {
    return (
      <div className="flex items-center gap-1">
        <div {...props} className="-ml-1 pl-2 text-sm">
          Trang Sau
        </div>
        <BsArrowRightShort size={22} className="text-[#777]" />
      </div>
    );
  };

  const renderLeftPagingButton = (props: any) => {
    return (
      <div className="flex items-center gap-1">
        <BsArrowLeftShort size={22} className="text-[#777]" />
        <div {...props} className="text-sm">
          Trang trước
        </div>
      </div>
    );
  };

  return (
    <Pagination
      count={pageCount}
      page={page}
      onChange={handleChange}
      renderItem={item => (
        <PaginationItem
          components={{
            next: props => renderRightPagingButton(props),
            previous: props => renderLeftPagingButton(props)
          }}
          {...item}
        />
      )}
    />
  );
};

export default TablePagination;
