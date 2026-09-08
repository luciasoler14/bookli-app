"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCoverUrl } from "../../utils/getCoverUrl";
import { getLanguageName } from "../../utils/languages";
import { useBookDetails } from "../../hooks/useBookDetails";
import BookActions from "../../components/BookActions";
import { BookDetailSkeleton } from "../../components/Skeleton";
import styles from "./page.module.css";

export default function BookDetailPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = use(params);
  const decodedKey = decodeURIComponent(key);

  const { data: details, isLoading } = useBookDetails(decodedKey);

  const book = details?.book;

  if (isLoading) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.loading}>
            <BookDetailSkeleton />
          </div>
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
                          {author.birth_date || "?"} —{" "}
                          {author.death_date || "?"}
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
                    <Link
                      key={subject}
                      href={`/?subject=${encodeURIComponent(subject)}`}
                      className={styles.subjectTag}
                    >
                      {subject}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.actions}>
              <BookActions book={book} variant="inline" size="md" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
