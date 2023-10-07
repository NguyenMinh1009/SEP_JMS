import React from "react";
import { useNavigate } from "react-router-dom";

interface CustomTabProps {
  selected?: boolean;
  to?: string;
  text: string;
}

const CustomTab: React.FC<CustomTabProps> = ({ selected, to, text }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        if (!to) return;
        navigate(to);
      }}
      className={`cursor-pointer rounded-md py-3  ${
        selected ? "bg-third px-4 font-[500]" : "text-secondary hover:opacity-70"
      }`}
    >
      {text}
    </div>
  );
};

export default CustomTab;
