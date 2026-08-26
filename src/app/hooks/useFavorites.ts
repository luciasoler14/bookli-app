"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Book } from "../components/BookCard";
import { withStorageDOMEvents } from "../utils/withStorageDOMEvents";

interface FavoriteEntry {
  book: Book;
  addedAt: string;
}

interface FavoritesState {
  favorites: Record<string, FavoriteEntry>;
  addFavorite: (book: Book) => void;
  removeFavorite: (bookKey: string) => void;
  toggleFavorite: (book: Book) => void;
  isFavorite: (bookKey: string) => boolean;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: {},
      addFavorite: (book) =>
        set((state) => ({
          favorites: {
            ...state.favorites,
            [book.key]: { book, addedAt: new Date().toISOString() },
          },
        })),
      removeFavorite: (bookKey) =>
        set((state) => {
          const next = { ...state.favorites };
          delete next[bookKey];
          return { favorites: next };
        }),
      toggleFavorite: (book) =>
        set((state) => {
          const next = { ...state.favorites };
          if (next[book.key]) {
            delete next[book.key];
          } else {
            next[book.key] = { book, addedAt: new Date().toISOString() };
          }
          return { favorites: next };
        }),
      isFavorite: (bookKey) => !!get().favorites[bookKey],
    }),
    {
      name: "bookli:favorites",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

if (typeof window !== "undefined") {
  withStorageDOMEvents(useFavorites);
}

export const useFavoriteList = () => {
  const favorites = useFavorites((state) => state.favorites);
  return Object.values(favorites).sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
  );
};
