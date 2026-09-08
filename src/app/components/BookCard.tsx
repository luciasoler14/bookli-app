"use client";

import { useState } from "react";
import Image from "next/image";
import { getCoverUrl } from "../utils/getCoverUrl";
import BookActions from "./BookActions";
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
  const [imgLoaded, setImgLoaded] = useState(false);

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
      <div className={styles.coverWrapper}>
        {book.cover_i ? (
          <>
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
          </>
        ) : (
          <div className={styles.noCover}>No Cover</div>
        )}
        <BookActions book={book} variant="overlay" />
      </div>
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
