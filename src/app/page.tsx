"use client";

import { useState } from "react";
import BookCard, { Book } from "./components/BookCard";
import BookModal from "./components/BookModal";
import ExploreByGenre from "./components/ExploreByGenre";
import Pagination from "./components/Pagination";
import TrendingBooks from "./components/TrendingBooks";
import { useBooks } from "./hooks/useBooks";
import styles from "./page.module.css";

const BOOKS_PER_PAGE = 20;

export default function Home() {
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const { data, isLoading, error } = useBooks(
    searchQuery,
    page,
    searchQuery.length > 0,
  );

  const searchBooks = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setPage(1);
    setSearchQuery(query);
  };

  const handleGenreSelect = (genre: string) => {
    setQuery(genre);
    setSearchQuery(genre);
    setPage(1);
  };

  const handleClear = () => {
    setQuery("");
    setSearchQuery("");
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const books = data?.docs || [];
  const numFound = data?.numFound || 0;
  const totalPages = Math.min(Math.ceil(numFound / BOOKS_PER_PAGE), 100);

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
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for books or authors..."
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={handleClear}
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="submit"
            className={styles.searchButton}
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </form>

        {!searchQuery && <ExploreByGenre onSelect={handleGenreSelect} />}

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
              Found {numFound.toLocaleString()} books for &quot;{searchQuery}
              &quot; — Page {page} of {totalPages}
            </h2>
            <div className={styles.bookGrid}>
              {books.map((book) => (
                <BookCard key={book.key} book={book} onClick={setSelectedBook} />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
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

        {!searchQuery && <TrendingBooks onBookClick={setSelectedBook} />}
      </main>
      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
}
