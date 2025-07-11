"use client";
import { create } from "zustand";

export type BreadcumbItem = {
  title: string;
  url: string;
};

type State = {
  items: BreadcumbItem[];
  setBreadcumb: (items: BreadcumbItem[]) => void;
};

export const useBreadcumb = create<State>((set) => ({
  items: [],
  setBreadcumb: (items) => set({ items }),
}));
