"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Book } from "./BookCard";
import { useBookDetails } from "../hooks/useBookDetails";
import styles from "./BookModal.module.css";

const getCoverUrl = (coverId: number) => {
  return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
};

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
        <div className={styles.content}>
          <div className={styles.coverSection}>
            {book.cover_i ? (
              <Image
                src={getCoverUrl(book.cover_i)}
                alt={book.title}
                className={styles.cover}
                width={200}
                height={300}
                unoptimized
              />
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
                  <span className={styles.metaLabel}>Publicado: </span>
                  {book.first_publish_year}
                </p>
              )}
              {details?.number_of_pages_median && (
                <p className={styles.metaItem}>
                  <span className={styles.metaLabel}>Páginas: </span>
                  {details.number_of_pages_median}
                </p>
              )}
              {book.publisher?.[0] && (
                <p className={styles.metaItem}>
                  <span className={styles.metaLabel}>Editorial: </span>
                  {book.publisher.slice(0, 3).join(", ")}
                </p>
              )}
              {book.language?.[0] && (
                <p className={styles.metaItem}>
                  <span className={styles.metaLabel}>Idioma: </span>
                  {book.language.slice(0, 3).join(", ")}
                </p>
              )}
              {book.isbn?.[0] && (
                <p className={styles.metaItem}>
                  <span className={styles.metaLabel}>ISBN: </span>
                  {book.isbn[0]}
                </p>
              )}
            </div>
            {isLoading ? (
              <p className={styles.descriptionLoading}>Cargando descripción...</p>
            ) : details?.description ? (
              <p className={styles.description}>{details.description}</p>
            ) : null}
            {details?.subjects && details.subjects.length > 0 && (
              <div className={styles.subjects}>
                {details.subjects.slice(0, 8).map((subject) => (
                  <span key={subject} className={styles.subjectTag}>
                    {subject}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
