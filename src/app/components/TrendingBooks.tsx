"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import BookCard, { Book } from "./BookCard";
import { useTrending } from "../hooks/useTrending";
import styles from "./TrendingBooks.module.css";

interface TrendingBooksProps {
  onBookClick?: (book: Book) => void;
}

export default function TrendingBooks({ onBookClick }: TrendingBooksProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const { data: books, isLoading, error } = useTrending("fiction", 6);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    const observer = new ResizeObserver(updateArrows);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      observer.disconnect();
    };
  }, [updateArrows, books]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -400 : 400;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

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
      <div className={styles.scrollWrapper}>
        {canScrollLeft && (
          <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={() => scroll("left")}>
            &#8249;
          </button>
        )}
        <div className={styles.scrollContainer} ref={scrollRef}>
          {books.map((book) => (
            <div key={book.key} className={styles.cardWrapper}>
              <BookCard book={book} onClick={onBookClick} />
            </div>
          ))}
        </div>
        {canScrollRight && (
          <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={() => scroll("right")}>
            &#8250;
          </button>
        )}
      </div>
    </section>
  );
}
