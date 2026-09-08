"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { getCoverUrl } from "../utils/getCoverUrl";
import { useFavorites } from "../hooks/useFavorites";
import { useReadingList, ReadingStatus } from "../hooks/useReadingList";
import { STATUS_LABELS } from "../utils/constants";
import styles from "./BookCard.module.css";

export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  publisher?: string[];
  language?: string[];
}

interface BookCardProps {
  book: Book;
  onClick?: (book: Book) => void;
  extra?: React.ReactNode;
}

export default function BookCard({ book, onClick, extra }: BookCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const {
    getStatus,
    addToReadingList,
    removeFromReadingList,
    updateStatus,
    isInReadingList,
  } = useReadingList();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const favorited = isFavorite(book.key);
  const inReadingList = isInReadingList(book.key);

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

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(book);
  };

  const handleReadingClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleSelectStatus = (e: React.MouseEvent, status: ReadingStatus) => {
    e.stopPropagation();
    if (inReadingList) {
      updateStatus(book.key, status);
    } else {
      addToReadingList(book, status);
    }
    setShowDropdown(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromReadingList(book.key);
    setShowDropdown(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1) {
      e.preventDefault();
      window.open(`/book/${encodeURIComponent(book.key)}`, "_blank");
    }
  };

  return (
    <div
      className={styles.card}
      onClick={() => onClick?.(book)}
      onMouseDown={handleMouseDown}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {book.cover_i ? (
        <div className={styles.coverWrapper}>
          <Image
            src={getCoverUrl(book.cover_i, "S")}
            alt=""
            className={`${styles.cover} ${styles.coverPlaceholder}`}
            fill
            sizes="200px"
            unoptimized
          />
          <Image
            src={getCoverUrl(book.cover_i, "M")}
            alt={book.title}
            className={`${styles.cover} ${imgLoaded ? styles.coverLoaded : ""}`}
            fill
            sizes="200px"
            unoptimized
            loading="eager"
            onLoad={() => setImgLoaded(true)}
          />
          <button
            className={`${styles.heart} ${favorited ? styles.heartActive : ""}`}
            onClick={handleHeartClick}
          >
            <Heart size={22} fill={favorited ? "currentColor" : "none"} />
          </button>
          <div className={styles.readingDropdown} ref={dropdownRef}>
            <button
              className={`${styles.readingBtn} ${inReadingList ? styles.readingBtnActive : ""}`}
              onClick={handleReadingClick}
            >
              {inReadingList ? STATUS_LABELS[getStatus(book.key)!] : "+"}
            </button>
            {showDropdown && (
              <div className={styles.dropdown}>
                {(["want", "reading", "read", "dropped"] as const).map((s) => (
                  <button
                    key={s}
                    className={`${styles.dropdownItem} ${getStatus(book.key) === s ? styles.dropdownItemActive : ""}`}
                    onClick={(e) => handleSelectStatus(e, s)}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
                {inReadingList && (
                  <button
                    className={styles.dropdownItem}
                    onClick={handleRemove}
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.noCover}>No Cover</div>
      )}
      <div className={styles.info}>
        <h3 className={styles.title}>{book.title}</h3>
        <p className={styles.author}>
          {book.author_name?.[0] || "Unknown Author"}
        </p>
        {book.first_publish_year && (
          <p className={styles.year}>Published: {book.first_publish_year}</p>
        )}
        {extra}
      </div>
    </div>
  );
}
