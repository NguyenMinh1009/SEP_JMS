import { create } from "zustand";

export interface IAvtRef {
  content: number;
  setContent: (value: number) => void;
  clear: () => void;
}
const useAvtRef = create<IAvtRef>(set => ({
  content: 0,
  setContent: (value: number) => set({ content: value }),
  clear: () => set({ content: 0 })
}));

export default useAvtRef;
