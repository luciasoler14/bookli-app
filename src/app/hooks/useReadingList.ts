"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Book } from "../components/BookCard";
import { withStorageDOMEvents } from "../utils/withStorageDOMEvents";

export type ReadingStatus = "want" | "reading" | "read" | "dropped";

interface ReadingEntry {
  book: Book;
  status: ReadingStatus;
  addedAt: string;
}

interface ReadingListState {
  readingList: Record<string, ReadingEntry>;
  addToReadingList: (book: Book, status?: ReadingStatus) => void;
  removeFromReadingList: (bookKey: string) => void;
  updateStatus: (bookKey: string, status: ReadingStatus) => void;
  getStatus: (bookKey: string) => ReadingStatus | undefined;
  isInReadingList: (bookKey: string) => boolean;
}

export const useReadingList = create<ReadingListState>()(
  persist(
    (set, get) => ({
      readingList: {},
      addToReadingList: (book, status = "want") =>
        set((state) => ({
          readingList: {
            ...state.readingList,
            [book.key]: { book, status, addedAt: new Date().toISOString() },
          },
        })),
      removeFromReadingList: (bookKey) =>
        set((state) => {
          const next = { ...state.readingList };
          delete next[bookKey];
          return { readingList: next };
        }),
      updateStatus: (bookKey, status) =>
        set((state) => {
          if (!state.readingList[bookKey]) return state;
          return {
            readingList: {
              ...state.readingList,
              [bookKey]: { ...state.readingList[bookKey], status },
            },
          };
        }),
      getStatus: (bookKey) => get().readingList[bookKey]?.status,
      isInReadingList: (bookKey) => !!get().readingList[bookKey],
    }),
    {
      name: "bookli:reading-list",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

if (typeof window !== "undefined") {
  withStorageDOMEvents(useReadingList);
}

export const useReadingListArray = () => {
  const readingList = useReadingList((state) => state.readingList);
  return Object.values(readingList).sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
  );
};
