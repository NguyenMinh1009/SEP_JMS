import { create } from "zustand";

export interface ITitle {
  content: string;
  setContent: (value: string) => void;
  clear: () => void;
}
const useTitle = create<ITitle>(set => ({
  content: "",
  setContent: (value: string) => set({ content: value }),
  clear: () => set({ content: "" })
}));

export default useTitle;
