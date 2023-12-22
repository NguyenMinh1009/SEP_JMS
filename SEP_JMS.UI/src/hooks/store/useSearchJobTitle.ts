import { create } from "zustand";

export interface ISearchJobTitle {
  content: string;
  setContent: (value: string) => void;
  clear: () => void;
}
const useSearchJobTitle = create<ISearchJobTitle>(set => ({
  content: "",
  setContent: (value: string) => set({ content: value }),
  clear: () => set({ content: "" })
}));

export default useSearchJobTitle;
