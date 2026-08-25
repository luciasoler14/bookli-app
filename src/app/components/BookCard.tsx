import Image from "next/image";
import { getCoverUrl } from "../utils/getCoverUrl";
import styles from "./BookCard.module.css";

export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  publisher?: string[];
  language?: string[];
  isbn?: string[];
}

interface BookCardProps {
  book: Book;
  onClick?: (book: Book) => void;
}

export default function BookCard({ book, onClick }: BookCardProps) {
  return (
    <div
      className={styles.card}
      onClick={() => onClick?.(book)}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {book.cover_i ? (
        <Image
          src={getCoverUrl(book.cover_i, "M")}
          alt={book.title}
          className={styles.cover}
          width={200}
          height={280}
          unoptimized
        />
      ) : (
        <div className={styles.noCover}>No Cover</div>
      )}
      <div className={styles.info}>
        <h3 className={styles.title}>{book.title}</h3>
        <p className={styles.author}>
          {book.author_name?.[0] || "Unknown Author"}
        </p>
        {book.first_publish_year && (
          <p className={styles.year}>Published: {book.first_publish_year}</p>
        )}
      </div>
    </div>
  );
}
