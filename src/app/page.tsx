"use client";

import { useState } from "react";
import BookCard from "./components/BookCard";
import TrendingBooks from "./components/TrendingBooks";
import { useBooks } from "./hooks/useBooks";
import styles from "./page.module.css";

export default function Home() {
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useBooks(
    searchQuery,
    searchQuery.length > 0,
  );

  const searchBooks = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchQuery(query);
  };

  const books = data?.docs || [];

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {!searchQuery && (
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
          <button
            type="submit"
            className={styles.searchButton}
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </form>

        {isLoading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Searching for books...</p>
          </div>
        )}

        {error && (
          <div className={styles.noResults}>
            <p>Error searching for books. Please try again.</p>
          </div>
        )}

        {!isLoading && books.length > 0 && (
          <section className={styles.results}>
            <h2 className={styles.resultsTitle}>
              Found {books.length} books for &quot;{searchQuery}&quot;
            </h2>
            <div className={styles.bookGrid}>
              {books.map((book) => (
                <BookCard key={book.key} book={book} />
              ))}
            </div>
          </section>
        )}

        {!isLoading && searchQuery && !error && books.length === 0 && (
          <div className={styles.noResults}>
            <p>
              No books found for &quot;{searchQuery}&quot;. Try a different
              search term.
            </p>
          </div>
        )}

        {!searchQuery && <TrendingBooks />}
      </main>
    </div>
  );
}
