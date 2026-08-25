"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  publisher?: string[];
  language?: string[];
  isbn?: string[];
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchBooks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20`
      );
      const data = await res.json();
      setBooks(data.docs || []);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const getCoverUrl = (coverId: number) => {
    return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {!searched && (
          <section className={styles.hero}>
            <h1 className={styles.title}>
              DISCOVER YOUR NEXT <br />
              <span className={styles.highlight}>GREAT READ</span>
            </h1>
            <p className={styles.subtitle}>
              Find your next book, save your favorites, and build your library.
            </p>
          </section>
        )}

        <form onSubmit={searchBooks} className={styles.searchForm}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for books, authors, or ISBN..."
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Searching for books...</p>
          </div>
        )}

        {!loading && books.length > 0 && (
          <section className={styles.results}>
            <h2 className={styles.resultsTitle}>
              Found {books.length} books for &quot;{query}&quot;
            </h2>
            <div className={styles.bookGrid}>
              {books.map((book) => (
                <div key={book.key} className={styles.bookCard}>
                  {book.cover_i ? (
                    <Image
                      src={getCoverUrl(book.cover_i)}
                      alt={book.title}
                      className={styles.bookCover}
                      width={200}
                      height={280}
                      unoptimized
                    />
                  ) : (
                    <div className={styles.noCover}>No Cover</div>
                  )}
                  <div className={styles.bookInfo}>
                    <h3 className={styles.bookTitle}>{book.title}</h3>
                    <p className={styles.bookAuthor}>
                      {book.author_name?.[0] || "Unknown Author"}
                    </p>
                    {book.first_publish_year && (
                      <p className={styles.bookYear}>
                        Published: {book.first_publish_year}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {!loading && searched && books.length === 0 && (
          <div className={styles.noResults}>
            <p>No books found for &quot;{query}&quot;. Try a different search term.</p>
          </div>
        )}
      </main>
    </div>
  );
}
