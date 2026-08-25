"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useFavorites } from "../hooks/useFavorites";
import { useReadingList, ReadingStatus } from "../hooks/useReadingList";
import { getCoverUrl } from "../utils/getCoverUrl";
import styles from "./library.module.css";

const STATUS_LABELS: Record<ReadingStatus, string> = {
  want: "Want to Read",
  reading: "Reading",
  read: "Read",
};

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<"favorites" | "reading">("favorites");
  const [statusFilter, setStatusFilter] = useState<ReadingStatus | "all">("all");
  const { favoriteList, removeFavorite } = useFavorites();
  const { readingListArray, removeFromReadingList, updateStatus } = useReadingList();

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
                  <div key={book.key} className={styles.card}>
                    {book.cover_i ? (
                      <div className={styles.coverWrapper}>
                        <Image
                          src={getCoverUrl(book.cover_i, "M")}
                          alt={book.title}
                          fill
                          unoptimized
                          className={styles.cover}
                        />
                      </div>
                    ) : (
                      <div className={styles.noCover}>No Cover</div>
                    )}
                    <div className={styles.cardInfo}>
                      <h3 className={styles.cardTitle}>{book.title}</h3>
                      <p className={styles.cardAuthor}>
                        {book.author_name?.[0] || "Unknown Author"}
                      </p>
                    </div>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeFavorite(book.key)}
                    >
                      ✕
                    </button>
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
                {filteredReading.map(({ book, status }) => (
                  <div key={book.key} className={styles.card}>
                    {book.cover_i ? (
                      <div className={styles.coverWrapper}>
                        <Image
                          src={getCoverUrl(book.cover_i, "M")}
                          alt={book.title}
                          fill
                          unoptimized
                          className={styles.cover}
                        />
                      </div>
                    ) : (
                      <div className={styles.noCover}>No Cover</div>
                    )}
                    <div className={styles.cardInfo}>
                      <h3 className={styles.cardTitle}>{book.title}</h3>
                      <p className={styles.cardAuthor}>
                        {book.author_name?.[0] || "Unknown Author"}
                      </p>
                      <select
                        className={styles.statusSelect}
                        value={status}
                        onChange={(e) =>
                          updateStatus(book.key, e.target.value as ReadingStatus)
                        }
                      >
                        <option value="want">Want to Read</option>
                        <option value="reading">Reading</option>
                        <option value="read">Read</option>
                      </select>
                    </div>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeFromReadingList(book.key)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
