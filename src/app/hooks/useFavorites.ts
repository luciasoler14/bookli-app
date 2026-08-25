"use client";

import { useState, useEffect, useCallback } from "react";
import { Book } from "../components/BookCard";

const STORAGE_KEY = "bookli:favorites";

interface FavoriteEntry {
  book: Book;
  addedAt: string;
}

type FavoritesMap = Record<string, FavoriteEntry>;

function readStorage(): FavoritesMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeStorage(data: FavoritesMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoritesMap>({});

  useEffect(() => {
    setFavorites(readStorage());
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setFavorites(readStorage());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const addFavorite = useCallback((book: Book) => {
    setFavorites((prev) => {
      const next = { ...prev, [book.key]: { book, addedAt: new Date().toISOString() } };
      writeStorage(next);
      return next;
    });
  }, []);

  const removeFavorite = useCallback((bookKey: string) => {
    setFavorites((prev) => {
      const next = { ...prev };
      delete next[bookKey];
      writeStorage(next);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((book: Book) => {
    setFavorites((prev) => {
      const next = { ...prev };
      if (next[book.key]) {
        delete next[book.key];
      } else {
        next[book.key] = { book, addedAt: new Date().toISOString() };
      }
      writeStorage(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((bookKey: string) => !!favorites[bookKey], [favorites]);

  const favoriteList = Object.values(favorites).sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
  );

  return { favorites, favoriteList, addFavorite, removeFavorite, toggleFavorite, isFavorite };
}
