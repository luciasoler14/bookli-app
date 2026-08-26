"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import BookCard, { Book } from "../components/BookCard";
import BookModal from "../components/BookModal";
import { useFavoriteList } from "../hooks/useFavorites";
import { useReadingListArray, ReadingStatus } from "../hooks/useReadingList";
import { STATUS_LABELS } from "../utils/constants";
import styles from "./library.module.css";

type Tab = "favorites" | "reading";

function LibraryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlTab = (searchParams.get("tab") as Tab) || "favorites";
  const [statusFilter, setStatusFilter] = useState<ReadingStatus | "all">("all");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const favoriteList = useFavoriteList();
  const readingListArray = useReadingListArray();

  const handleTabChange = (tab: Tab) => {
    const params = new URLSearchParams();
    if (tab !== "favorites") params.set("tab", tab);
    const qs = params.toString();
    router.push(qs ? `/library?${qs}` : "/library", { scroll: false });
  };

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
            className={`${styles.tab} ${urlTab === "favorites" ? styles.tabActive : ""}`}
            onClick={() => handleTabChange("favorites")}
          >
            Favorites ({favoriteList.length})
          </button>
          <button
            className={`${styles.tab} ${urlTab === "reading" ? styles.tabActive : ""}`}
            onClick={() => handleTabChange("reading")}
          >
            Reading List ({readingListArray.length})
          </button>
        </div>

        {urlTab === "favorites" && (
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

        {urlTab === "reading" && (
          <section>
            <div className={styles.filters}>
              {(["all", "want", "reading", "read", "dropped"] as const).map((s) => (
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

export default function LibraryPage() {
  return (
    <Suspense>
      <LibraryContent />
    </Suspense>
  );
}
