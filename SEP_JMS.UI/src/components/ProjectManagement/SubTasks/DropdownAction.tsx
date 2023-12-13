import React, { useState, useEffect, useRef } from "react";
import { AiOutlineEllipsis } from "react-icons/ai";
import { CorrelationJobType } from "../../../enums/correlationJobType";
import { VisibleType } from "../../../enums/visibleType";
import { PathString } from "../../../enums/MapRouteToBreadCrumb";
import { useNavigate, useParams, redirect } from "react-router-dom";
import AlwayxInstance from "../../../api/AxiosInstance";
import CustomDialog from "../../common/CustomDialog";
import useSnakeBar from "../../../hooks/store/useSnakeBar";
import { IComments } from "../../../interface/comment";
import useCurrentPerson from "../../../hooks/store/useCurrentPerson";
import { Role } from "../../../enums/Role";
import { render } from "react-dom";

interface IDropdownAction {
  visibleType: VisibleType;
  finishedOnly?: boolean;
  subTaskId: any;
  removeSubTask?: (id: any) => void;
}

const DropdownAction: React.FC<IDropdownAction> = ({
  visibleType,
  finishedOnly,
  subTaskId,
  removeSubTask
}) => {
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { taskId } = useParams();
  const snakeBar = useSnakeBar();
  const currentPerson = useCurrentPerson();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      // Kiểm tra xem click có là bên ngoài dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false); // Đóng dropdown nếu click bên ngoài
      }
    };

    // Thêm event listener khi component được mount
    document.addEventListener("click", handleOutsideClick);

    // Cleanup event listener khi component bị unmount
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const getLinkForViewJob = (): string => {
    if (finishedOnly)
      return `/${PathString.VIEC_DA_XONG}/${PathString.VIEC_DU_AN}/${taskId}/${subTaskId}`;
    if (visibleType === VisibleType.Public)
      return `/${PathString.CONG_KHAI}/${PathString.VIEC_DU_AN}/${taskId}/${subTaskId}`;
    return `/${PathString.NOI_BO}/${PathString.VIEC_DU_AN}/${taskId}/${subTaskId}`;
  };

  const getLinkForEditJob = () => {
    return getLinkForViewJob() + `/${PathString.CHINH_SUA}`;
  };
  const handleViewClick = () => {
    navigate(getLinkForViewJob());
  };

  const handleUpdateClick = () => {
    navigate(getLinkForEditJob());
  };

  const handleClose = () => {
    setOpenConfirmDialog(false);
  };

  const handleClickDeleteTask = () => setOpenConfirmDialog(true);

  const handleDeleteTask = async () => {
    try {
      const deleteUrl = "job/" + subTaskId;
      await AlwayxInstance.delete(deleteUrl);
      removeSubTask?.(subTaskId);
      snakeBar.setSnakeBar("Xoá công việc thành công!", "success", true);
    } catch (error) {
      console.error(error);
    }
  };

  const renderUpdateButton = () => {
    if (finishedOnly) {
      if (currentPerson.roleType === Role.ADMIN)
        return (
          <button
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            onClick={handleUpdateClick}
          >
            Update
          </button>
        );
    } else {
      return (
        <button
          className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          onClick={handleUpdateClick}
        >
          Update
        </button>
      );
    }
  };

  const renderDeleteButton = () => {
    if (currentPerson.roleType === Role.ADMIN) {
      return (
        <button
          className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          onClick={handleClickDeleteTask}
        >
          Delete
        </button>
      );
    }
  };

  return (
    <>
      <CustomDialog
        openDialog={openConfirmDialog}
        handleClose={handleClose}
        title="Bạn có muốn xoá công việc này?"
        description="Một khi xoá, dữ liệu sẽ không thể khôi phục!"
        primaryBtnText="Quay trở lại"
        secondaryBtnText="Đồng ý xoá"
        primaryBtnCallback={handleClose}
        secondaryBtnCallback={handleDeleteTask}
      />
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <div>
          <button
            type="button"
            className="text-custom-text-200 hover:text-custom-text-100 hover:bg-custom-background-80 relative grid cursor-pointer place-items-center rounded p-1 outline-none"
            id="headlessui-menu-button"
            aria-haspopup="true"
            aria-expanded={isOpen ? "true" : "false"}
            onClick={toggleDropdown}
          >
            <AiOutlineEllipsis />
          </button>
        </div>

        {isOpen && (
          <div className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md border border-gray-300 bg-white shadow-lg">
            <div className="py-1">
              <button
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                onClick={handleViewClick}
              >
                View
              </button>
              {renderUpdateButton()}
              {renderDeleteButton()}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DropdownAction;
