import { AlertColor } from "@mui/material";
import { create } from "zustand";

interface ISnakeBar {
	isShow: boolean;
	severity: AlertColor;
	message: string;
	setSnakeBar: (message: string, severity: AlertColor, isShow: boolean) => void;
	setShow: (isShow: boolean) => void;
}
const useSnakeBar = create<ISnakeBar>((set) => ({
	isShow: false,
	severity: "success",
	message: "",
	setSnakeBar: (message: string, severity: AlertColor, isShow: boolean) =>
		set({ isShow: isShow, message: message, severity: severity }),
	setShow: (show: boolean) => set({ isShow: show }),
}));

export default useSnakeBar;
