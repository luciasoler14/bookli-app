"use client";

import { useRef, useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Book } from "./BookCard";
import { useFavorites } from "../hooks/useFavorites";
import { useReadingList, ReadingStatus } from "../hooks/useReadingList";
import { STATUS_LABELS } from "../utils/constants";
import styles from "./BookActions.module.css";

const STATUSES: ReadingStatus[] = ["want", "reading", "read", "dropped"];

interface BookActionsProps {
  book: Book;
  variant: "overlay" | "inline";
  size?: "sm" | "md";
}

export default function BookActions({
  book,
  variant,
  size = "md",
}: BookActionsProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const {
    getStatus,
    addToReadingList,
    removeFromReadingList,
    updateStatus,
    isInReadingList,
  } = useReadingList();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showDropdown) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const favorited = isFavorite(book.key);
  const inList = isInReadingList(book.key);
  const status = getStatus(book.key);

  const selectStatus = (s: ReadingStatus) => {
    if (inList) {
      updateStatus(book.key, s);
    } else {
      addToReadingList(book, s);
    }
    setShowDropdown(false);
  };

  const remove = () => {
    removeFromReadingList(book.key);
    setShowDropdown(false);
  };

  if (variant === "overlay") {
    const stop = (fn: () => void) => (e: React.MouseEvent) => {
      e.stopPropagation();
      fn();
    };

    return (
      <>
        <button
          className={`${styles.heart} ${favorited ? styles.heartActive : ""}`}
          onClick={stop(() => toggleFavorite(book))}
        >
          <Heart size={22} fill={favorited ? "currentColor" : "none"} />
        </button>
        <div className={styles.readingDropdown} ref={dropdownRef}>
          <button
            className={`${styles.readingBtn} ${inList ? styles.readingBtnActive : ""}`}
            onClick={stop(() => setShowDropdown(!showDropdown))}
          >
            {inList ? STATUS_LABELS[status!] : "+"}
          </button>
          {showDropdown && (
            <div className={styles.overlayDropdown}>
              {STATUSES.map((s) => (
                <button
                  key={s}
                  className={`${styles.overlayDropdownItem} ${status === s ? styles.overlayDropdownItemActive : ""}`}
                  onClick={stop(() => selectStatus(s))}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
              {inList && (
                <button
                  className={styles.overlayDropdownItem}
                  onClick={stop(remove)}
                >
                  Remove
                </button>
              )}
            </div>
          )}
        </div>
      </>
    );
  }

  const sizeClass = size === "sm" ? styles.actionBtnSm : "";

  return (
    <>
      <button
        className={`${styles.actionBtn} ${sizeClass} ${favorited ? styles.actionBtnActive : ""}`}
        onClick={() => toggleFavorite(book)}
      >
        <span>{favorited ? "♥" : "♡"}</span>
        <span>{favorited ? "Favorited" : "Favorite"}</span>
      </button>
      <div className={styles.dropdownWrapper} ref={dropdownRef}>
        <button
          className={`${styles.actionBtn} ${sizeClass} ${inList ? styles.actionBtnReading : ""}`}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {inList ? STATUS_LABELS[status!] : "+ Reading List"}
        </button>
        {showDropdown && (
          <div className={styles.dropdown}>
            {STATUSES.map((s) => (
              <button
                key={s}
                className={`${styles.dropdownItem} ${status === s ? styles.dropdownItemActive : ""}`}
                onClick={() => selectStatus(s)}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
            {inList && (
              <button className={styles.dropdownItem} onClick={remove}>
                Remove
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
