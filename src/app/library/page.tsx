"use client";

import { useState } from "react";
import Link from "next/link";
import BookCard, { Book } from "../components/BookCard";
import BookModal from "../components/BookModal";
import { useFavorites } from "../hooks/useFavorites";
import { useReadingList, ReadingStatus } from "../hooks/useReadingList";
import styles from "./library.module.css";

const STATUS_LABELS: Record<ReadingStatus, string> = {
  want: "Want to Read",
  reading: "Reading",
  read: "Read",
};

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<"favorites" | "reading">("favorites");
  const [statusFilter, setStatusFilter] = useState<ReadingStatus | "all">("all");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { favoriteList } = useFavorites();
  const { readingListArray } = useReadingList();

  const filteredReading =
    statusFilter === "all"
      ? readingListArray
      : readingListArray.filter((e) => e.status === statusFilter);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>My Library</h1>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "favorites" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("favorites")}
          >
            Favorites ({favoriteList.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === "reading" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("reading")}
          >
            Reading List ({readingListArray.length})
          </button>
        </div>

        {activeTab === "favorites" && (
          <section>
            {favoriteList.length === 0 ? (
              <div className={styles.empty}>
                <p>You don&apos;t have any favorites yet.</p>
                <Link href="/" className={styles.exploreLink}>
                  Explore books
                </Link>
              </div>
            ) : (
              <div className={styles.grid}>
                {favoriteList.map(({ book }) => (
                  <div key={book.key} className={styles.cardWrapper}>
                    <BookCard book={book} onClick={setSelectedBook} />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "reading" && (
          <section>
            <div className={styles.filters}>
              {(["all", "want", "reading", "read"] as const).map((s) => (
                <button
                  key={s}
                  className={`${styles.filterBtn} ${statusFilter === s ? styles.filterActive : ""}`}
                  onClick={() => setStatusFilter(s)}
                >
                  {s === "all" ? "All" : STATUS_LABELS[s]}
                </button>
              ))}
            </div>
            {filteredReading.length === 0 ? (
              <div className={styles.empty}>
                <p>Your reading list is empty.</p>
                <Link href="/" className={styles.exploreLink}>
                  Explore books
                </Link>
              </div>
            ) : (
              <div className={styles.grid}>
                {filteredReading.map(({ book }) => (
                  <div key={book.key} className={styles.cardWrapper}>
                    <BookCard book={book} onClick={setSelectedBook} />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
}
