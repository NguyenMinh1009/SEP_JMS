import React, { useState, useEffect, useRef } from "react";
import { AiOutlineEllipsis } from "react-icons/ai";

const DropdownMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
  }, []); // Empty dependency array means this effect will only run once when component mounts

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleViewClick = () => {
    console.log("View action");
    setIsOpen(false);
  };

  const handleUpdateClick = () => {
    console.log("Update action");
    setIsOpen(false);
  };

  const handleDeleteClick = () => {
    console.log("Delete action");
    setIsOpen(false);
  };

  return (
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
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              onClick={handleUpdateClick}
            >
              Update
            </button>
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              onClick={handleDeleteClick}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
