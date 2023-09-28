import { create } from "zustand";

interface ISidebar {
  isExpand: boolean;
  setExpand: (value: boolean) => void;
}
const useSideBarPanel = create<ISidebar>(set => ({
  isExpand: true,
  setExpand: (isExpand: boolean) => set({ isExpand: isExpand })
}));

export default useSideBarPanel;
