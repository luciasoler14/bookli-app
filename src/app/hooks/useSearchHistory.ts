"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { withStorageDOMEvents } from "../utils/withStorageDOMEvents";

const MAX_HISTORY = 5;

interface SearchHistoryState {
  history: string[];
  addSearch: (query: string) => void;
  removeSearch: (query: string) => void;
  clearHistory: () => void;
}

export const useSearchHistory = create<SearchHistoryState>()(
  persist(
    (set) => ({
      history: [],
      addSearch: (query) => {
        const trimmed = query.trim();
        if (!trimmed) return;
        set((state) => {
          const filtered = state.history.filter((h) => h !== trimmed);
          return { history: [trimmed, ...filtered].slice(0, MAX_HISTORY) };
        });
      },
      removeSearch: (query) =>
        set((state) => ({
          history: state.history.filter((h) => h !== query),
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "bookli:search-history",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

if (typeof window !== "undefined") {
  withStorageDOMEvents(useSearchHistory);
}
