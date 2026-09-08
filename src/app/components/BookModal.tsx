"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Book } from "./BookCard";
import { getCoverUrl } from "../utils/getCoverUrl";
import { getLanguageName } from "../utils/languages";
import { useBookDetails } from "../hooks/useBookDetails";
import BookActions from "./BookActions";
import actionStyles from "./BookActions.module.css";
import styles from "./BookModal.module.css";

interface BookModalProps {
  book: Book;
  onClose: () => void;
}

export default function BookModal({ book, onClose }: BookModalProps) {
  const { data: details, isLoading } = useBookDetails(book.key);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        <div className={styles.scrollArea}>
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
              <h2 className={styles.title}>{book.title}</h2>
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
              {isLoading ? (
                <div className={styles.descriptionLoading}>
                  <div className={styles.skeletonLine} />
                  <div className={styles.skeletonLine} />
                  <div className={styles.skeletonLineShort} />
                </div>
              ) : details?.description ? (
                <p className={styles.description}>{details.description}</p>
              ) : null}
              {details?.subjects && details.subjects.length > 0 && (
                <div className={styles.subjects}>
                  {details.subjects.slice(0, 8).map((subject) => (
                    <Link
                      key={subject}
                      href={`/?subject=${encodeURIComponent(subject)}`}
                      className={styles.subjectTag}
                      onClick={onClose}
                    >
                      {subject}
                    </Link>
                  ))}
                </div>
              )}
              <div className={styles.actions}>
                <Link
                  href={`/book/${encodeURIComponent(book.key)}`}
                  className={`${actionStyles.actionBtn} ${actionStyles.actionBtnSm}`}
                  onClick={onClose}
                >
                  Details →
                </Link>
                <BookActions book={book} variant="inline" size="sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
