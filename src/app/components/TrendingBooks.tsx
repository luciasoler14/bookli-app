"use client";

import { useRef, useState, useCallback } from "react";
import BookCard, { Book } from "./BookCard";
import { useTrending } from "../hooks/useTrending";
import styles from "./TrendingBooks.module.css";

interface TrendingBooksProps {
  onBookClick?: (book: Book) => void;
}

export default function TrendingBooks({ onBookClick }: TrendingBooksProps) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const { data: books, isLoading, error } = useTrending("fiction", 6);

  const touchState = useRef({ startX: 0, startY: 0, isDragging: false, scrollLeft: 0 });

  const updateArrows = useCallback(() => {
    const el = elRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  function handleTouchStart(e: TouchEvent) {
    const el = elRef.current;
    if (!el) return;
    touchState.current = {
      startX: e.touches[0].pageX,
      startY: e.touches[0].pageY,
      isDragging: true,
      scrollLeft: el.scrollLeft,
    };
  }

  function handleTouchMove(e: TouchEvent) {
    if (!touchState.current.isDragging) return;
    const el = elRef.current;
    if (!el) return;

    const deltaX = e.touches[0].pageX - touchState.current.startX;
    const deltaY = e.touches[0].pageY - touchState.current.startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault();
      el.scrollLeft = touchState.current.scrollLeft - deltaX;
    }
  }

  function handleTouchEnd() {
    touchState.current.isDragging = false;
  }

  const scrollRefCallback = useCallback(
    (node: HTMLDivElement | null) => {
      if (elRef.current) {
        elRef.current.removeEventListener("scroll", updateArrows);
        elRef.current.removeEventListener("touchstart", handleTouchStart);
        elRef.current.removeEventListener("touchmove", handleTouchMove);
        elRef.current.removeEventListener("touchend", handleTouchEnd);
      }

      elRef.current = node;

      if (node) {
        updateArrows();
        node.addEventListener("scroll", updateArrows, { passive: true });
        node.addEventListener("touchstart", handleTouchStart, { passive: true });
        node.addEventListener("touchmove", handleTouchMove, { passive: false });
        node.addEventListener("touchend", handleTouchEnd, { passive: true });
      }
    },
    [updateArrows],
  );

  const scroll = (direction: "left" | "right") => {
    const el = elRef.current;
    if (!el) return;
    const amount = direction === "left" ? -400 : 400;
    el.scrollBy({ left: amount, behavior: "smooth" });
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
        <div className={styles.scrollContainer} ref={scrollRefCallback}>
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
