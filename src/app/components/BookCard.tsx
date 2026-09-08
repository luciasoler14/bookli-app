"use client";

import BookActions from "./BookActions";
import BookCover from "./BookCover";
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
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1) {
      e.preventDefault();
      window.open(`/book/${encodeURIComponent(book.key)}`, "_blank");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!onClick) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(book);
    }
  };

  return (
    <div
      className={styles.card}
      onClick={() => onClick?.(book)}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={styles.coverWrapper}>
        <BookCover
          book={book}
          size="M"
          sizes="200px"
          progressive
          noCoverClassName={styles.noCover}
        />
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
