"use client";

import { useState } from "react";
import Image from "next/image";
import { Book } from "./BookCard";
import { getCoverUrl } from "../utils/getCoverUrl";
import styles from "./BookCover.module.css";

interface BookCoverProps {
  book: Book;
  size: "S" | "M" | "L";
  className?: string;
  noCoverClassName?: string;
  sizes?: string;
  progressive?: boolean;
}

export default function BookCover({
  book,
  size,
  className,
  noCoverClassName,
  sizes,
  progressive = false,
}: BookCoverProps) {
  const [loaded, setLoaded] = useState(false);

  if (!book.cover_i) {
    return <div className={noCoverClassName}>No Cover</div>;
  }

  if (progressive) {
    return (
      <>
        <Image
          src={getCoverUrl(book.cover_i, "S")}
          alt=""
          className={`${styles.image} ${styles.placeholder} ${className ?? ""}`}
          fill
          sizes={sizes}
          unoptimized
        />
        <Image
          src={getCoverUrl(book.cover_i, size)}
          alt={book.title}
          className={`${styles.image} ${loaded ? styles.loaded : ""} ${className ?? ""}`}
          fill
          sizes={sizes}
          unoptimized
          loading="eager"
          onLoad={() => setLoaded(true)}
        />
      </>
    );
  }

  return (
    <Image
      src={getCoverUrl(book.cover_i, size)}
      alt={book.title}
      className={className}
      fill
      unoptimized
    />
  );
}
