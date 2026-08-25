"use client";

import { useState, useEffect, useCallback } from "react";
import { Book } from "../components/BookCard";

const STORAGE_KEY = "bookli:reading-list";

export type ReadingStatus = "want" | "reading" | "read";

interface ReadingEntry {
  book: Book;
  status: ReadingStatus;
  addedAt: string;
}

type ReadingMap = Record<string, ReadingEntry>;

function readStorage(): ReadingMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeStorage(data: ReadingMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useReadingList() {
  const [readingList, setReadingList] = useState<ReadingMap>({});

  useEffect(() => {
    setReadingList(readStorage());
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setReadingList(readStorage());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const addToReadingList = useCallback((book: Book, status: ReadingStatus = "want") => {
    setReadingList((prev) => {
      const next = { ...prev, [book.key]: { book, status, addedAt: new Date().toISOString() } };
      writeStorage(next);
      return next;
    });
  }, []);

  const removeFromReadingList = useCallback((bookKey: string) => {
    setReadingList((prev) => {
      const next = { ...prev };
      delete next[bookKey];
      writeStorage(next);
      return next;
    });
  }, []);

  const updateStatus = useCallback((bookKey: string, status: ReadingStatus) => {
    setReadingList((prev) => {
      if (!prev[bookKey]) return prev;
      const next = { ...prev, [bookKey]: { ...prev[bookKey], status } };
      writeStorage(next);
      return next;
    });
  }, []);

  const getStatus = useCallback((bookKey: string) => readingList[bookKey]?.status, [readingList]);

  const isInReadingList = useCallback((bookKey: string) => !!readingList[bookKey], [readingList]);

  const readingListArray = Object.values(readingList).sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
  );

  return { readingList, readingListArray, addToReadingList, removeFromReadingList, updateStatus, getStatus, isInReadingList };
}
