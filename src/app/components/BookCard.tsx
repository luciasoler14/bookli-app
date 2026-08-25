import Image from "next/image";
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
}

const getCoverUrl = (coverId: number) => {
  return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
};

export default function BookCard({ book }: BookCardProps) {
  return (
    <div className={styles.card}>
      {book.cover_i ? (
        <Image
          src={getCoverUrl(book.cover_i)}
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
