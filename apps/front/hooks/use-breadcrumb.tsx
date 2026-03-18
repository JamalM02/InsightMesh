"use client";
import { create } from "zustand";

export type BreadcrumbItem = {
  title: string;
  url: string;
};

type State = {
  items: BreadcrumbItem[];
  setBreadcrumb: (items: BreadcrumbItem[]) => void;
};

export const useBreadcrumb = create<State>((set) => ({
  items: [],
  setBreadcrumb: (items) => set({ items }),
}));
