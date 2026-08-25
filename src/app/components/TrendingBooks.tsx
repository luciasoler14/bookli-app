"use client";

import BookCard, { Book } from "./BookCard";
import { useTrending } from "../hooks/useTrending";
import styles from "./TrendingBooks.module.css";

interface TrendingBooksProps {
  onBookClick?: (book: Book) => void;
}

export default function TrendingBooks({ onBookClick }: TrendingBooksProps) {
  const { data: books, isLoading, error } = useTrending("fiction", 6);

  if (isLoading) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>🔥 Trending / Popular</h2>
        <div className={styles.loading}>Loading trending books...</div>
      </section>
    );
  }

  if (error || !books?.length) {
    return null;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>🔥 Trending / Popular</h2>
      <div className={styles.scrollContainer}>
        {books.map((book) => (
          <div key={book.key} className={styles.cardWrapper}>
            <BookCard book={book} onClick={onBookClick} />
          </div>
        ))}
      </div>
    </section>
  );
}
