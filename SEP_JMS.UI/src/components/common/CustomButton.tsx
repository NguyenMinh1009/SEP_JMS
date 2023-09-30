import React from "react";
import Button, { ButtonProps } from "@mui/material/Button/Button";

interface ICustomButtonProps extends ButtonProps {
  primary?: boolean;
  disablePadding?: boolean;
}

const CustomButton: React.FC<ICustomButtonProps> = ({
  sx,
  disabled,
  onClick,
  disablePadding,
  className,
  children,
  primary
}) => {
  return (
    <Button
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={`flex items-center justify-center transition-all ${
        disablePadding ? "p-0" : "p-2"
      } min-w-0 rounded-md ${primary ? "bg-accent" : ""} ${className ?? ""}`}
      sx={{
        "&:disabled": {
          backgroundColor: "#ccc",
          color: "#666",
          cursor: "not-allowed",
          pointerEvents: "unset"
        },
        "&:hover": { opacity: 0.6, backgroundColor: primary ? "#0054a6" : "transparent" },
        "&:disabled:hover": { opacity: 1, backgroundColor: "#ccc" },
        ...sx
      }}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
