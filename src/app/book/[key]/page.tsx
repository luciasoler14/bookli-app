"use client";

import { use, useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCoverUrl } from "../../utils/getCoverUrl";
import { getLanguageName } from "../../utils/languages";
import { useBookDetails } from "../../hooks/useBookDetails";
import { useFavorites } from "../../hooks/useFavorites";
import { useReadingList, ReadingStatus } from "../../hooks/useReadingList";
import styles from "./page.module.css";

const STATUS_LABELS: Record<ReadingStatus, string> = {
  want: "Want to Read",
  reading: "Reading",
  read: "Read",
};

export default function BookDetailPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = use(params);
  const decodedKey = decodeURIComponent(key);

  const { data: details, isLoading } = useBookDetails(decodedKey);
  const { isFavorite, toggleFavorite } = useFavorites();
  const {
    getStatus,
    addToReadingList,
    removeFromReadingList,
    updateStatus,
    isInReadingList,
  } = useReadingList();

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showDropdown) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const book = details?.book;
  const isFav = book ? isFavorite(book.key) : false;
  const inList = book ? isInReadingList(book.key) : false;

  if (isLoading) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.loading}>Loading book details...</div>
        </main>
      </div>
    );
  }

  if (!book) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.empty}>
            <p>Book not found.</p>
            <Link href="/" className={styles.backLink}>
              Back to Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Link href="/" className={styles.backLink}>
          ← Back to Home
        </Link>

        <div className={styles.content}>
          <div className={styles.coverSection}>
            {book.cover_i ? (
              <div className={styles.coverWrapper}>
                <Image
                  src={getCoverUrl(book.cover_i, "L")}
                  alt={book.title}
                  className={styles.cover}
                  fill
                  unoptimized
                />
              </div>
            ) : (
              <div className={styles.noCover}>No Cover</div>
            )}
          </div>

          <div className={styles.details}>
            <h1 className={styles.title}>{book.title}</h1>
            <p className={styles.authors}>
              {book.author_name?.join(", ") || "Unknown Author"}
            </p>

            <div className={styles.meta}>
              {book.first_publish_year && (
                <p className={styles.metaItem}>
                  <span className={styles.metaLabel}>Published: </span>
                  {book.first_publish_year}
                </p>
              )}
              {details?.number_of_pages_median && (
                <p className={styles.metaItem}>
                  <span className={styles.metaLabel}>Pages: </span>
                  {details.number_of_pages_median}
                </p>
              )}
              {book.publisher?.[0] && (
                <p className={styles.metaItem}>
                  <span className={styles.metaLabel}>Publisher: </span>
                  {book.publisher.slice(0, 3).join(", ")}
                </p>
              )}
              {book.language?.[0] && (
                <p className={styles.metaItem}>
                  <span className={styles.metaLabel}>Language: </span>
                  {book.language.slice(0, 3).map(getLanguageName).join(", ")}
                </p>
              )}
            </div>

            {details?.description && (
              <div className={styles.descriptionSection}>
                <h3 className={styles.sectionTitle}>Description</h3>
                <p className={styles.description}>{details.description}</p>
              </div>
            )}

            {details?.authors && details.authors.length > 0 && (
              <div className={styles.authorSection}>
                <h3 className={styles.sectionTitle}>Authors</h3>
                <div className={styles.authorCards}>
                  {details.authors.map((author, i) => (
                    <div key={i} className={styles.authorCard}>
                      <h4 className={styles.authorName}>{author.name}</h4>
                      {(author.birth_date || author.death_date) && (
                        <p className={styles.authorDates}>
                          {author.birth_date || "?"} — {author.death_date || "?"}
                        </p>
                      )}
                      {author.bio && (
                        <p className={styles.authorBio}>{author.bio}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {details?.subjects && details.subjects.length > 0 && (
              <div className={styles.subjectsSection}>
                <h3 className={styles.sectionTitle}>Subjects</h3>
                <div className={styles.subjects}>
                  {details.subjects.slice(0, 12).map((subject) => (
                    <span key={subject} className={styles.subjectTag}>
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.actions}>
              <button
                className={`${styles.actionBtn} ${isFav ? styles.actionBtnActive : ""}`}
                onClick={() => book && toggleFavorite(book)}
              >
                <span>{isFav ? "♥" : "♡"}</span>
                <span>{isFav ? "Favorited" : "Favorite"}</span>
              </button>

              <div className={styles.dropdownWrapper} ref={dropdownRef}>
                <button
                  className={`${styles.actionBtn} ${inList ? styles.actionBtnReading : ""}`}
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {inList ? STATUS_LABELS[getStatus(book.key)!] : "Reading List"}
                </button>
                {showDropdown && (
                  <div className={styles.dropdown}>
                    {(["want", "reading", "read"] as const).map((s) => (
                      <button
                        key={s}
                        className={`${styles.dropdownItem} ${getStatus(book.key) === s ? styles.dropdownItemActive : ""}`}
                        onClick={() => {
                          if (inList) {
                            updateStatus(book.key, s);
                          } else {
                            addToReadingList(book, s);
                          }
                          setShowDropdown(false);
                        }}
                      >
                        {STATUS_LABELS[s]}
                      </button>
                    ))}
                    {inList && (
                      <button
                        className={styles.dropdownItem}
                        onClick={() => {
                          removeFromReadingList(book.key);
                          setShowDropdown(false);
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
