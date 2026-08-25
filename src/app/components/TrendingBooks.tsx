"use client";

import BookCard from "./BookCard";
import { useTrending } from "../hooks/useTrending";
import styles from "./TrendingBooks.module.css";

export default function TrendingBooks() {
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
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </section>
  );
}
