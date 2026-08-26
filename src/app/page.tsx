"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BookCard, { Book } from "./components/BookCard";
import BookModal from "./components/BookModal";
import ExploreByGenre from "./components/ExploreByGenre";
import Pagination from "./components/Pagination";
import TrendingBooks from "./components/TrendingBooks";
import { useBooks } from "./hooks/useBooks";
import { useSubjectBooks } from "./hooks/useSubjectBooks";
import { useSearchHistory } from "./hooks/useSearchHistory";
import { SearchResultsSkeleton } from "./components/Skeleton";
import styles from "./page.module.css";

const BOOKS_PER_PAGE = 20;

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlQuery = searchParams.get("q") || "";
  const urlSubject = searchParams.get("subject") || null;
  const urlPage = parseInt(searchParams.get("page") || "1", 10);

  const [query, setQuery] = useState(urlQuery);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { history, addSearch, removeSearch } = useSearchHistory();

  const isSubjectSearch = !!urlSubject && !urlQuery;

  const { data: searchData, isLoading: searchLoading, error: searchError } = useBooks(
    urlQuery,
    urlPage,
    urlQuery.length > 0 && !isSubjectSearch,
  );

  const { data: subjectData, isLoading: subjectLoading } = useSubjectBooks(
    isSubjectSearch ? urlSubject : null,
    urlPage,
  );

  const isLoading = isSubjectSearch ? subjectLoading : searchLoading;
  const error = isSubjectSearch ? null : searchError;

  const books = isSubjectSearch ? (subjectData?.books || []) : (searchData?.docs || []);
  const numFound = isSubjectSearch ? (subjectData?.numFound || 0) : (searchData?.numFound || 0);
  const totalPages = Math.min(Math.ceil(numFound / BOOKS_PER_PAGE), 100);

  const displayTitle = isSubjectSearch
    ? urlSubject!.charAt(0).toUpperCase() + urlSubject!.slice(1)
    : urlQuery;

  const updateURL = (q: string, page: number, subject?: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (subject) params.set("subject", subject);
    if (page > 1) params.set("page", page.toString());
    const qs = params.toString();
    router.push(qs ? `/?${qs}` : "/", { scroll: false });
  };

  const searchBooks = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    updateURL(query, 1);
    addSearch(query);
  };

  const handleGenreSelect = (genre: string) => {
    setQuery(genre);
    updateURL("", 1, genre.toLowerCase());
  };

  const handleClear = () => {
    setQuery("");
    router.push("/");
  };

  const handleHistoryClick = (term: string) => {
    setQuery(term);
    updateURL(term, 1);
    addSearch(term);
  };

  const handlePageChange = (newPage: number) => {
    if (isSubjectSearch) {
      updateURL("", newPage, urlSubject!);
    } else {
      updateURL(urlQuery, newPage);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showHero = !urlQuery && !isSubjectSearch;
  const showHistory = !urlQuery && !isSubjectSearch && history.length > 0;
  const showGenres = !urlQuery && !isSubjectSearch;
  const showTrending = !urlQuery && !isSubjectSearch;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {showHero && (
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
            {(urlQuery || isSubjectSearch) && (
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

        {showHistory && (
          <div className={styles.history}>
            {history.map((term) => (
              <div key={term} className={styles.historyChip}>
                <button
                  className={styles.historyTerm}
                  onClick={() => handleHistoryClick(term)}
                >
                  {term}
                </button>
                <button
                  className={styles.historyRemove}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSearch(term);
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {showGenres && <ExploreByGenre onSelect={handleGenreSelect} />}

        {isLoading && (
          <section className={styles.results}>
            <SearchResultsSkeleton />
          </section>
        )}

        {error && (
          <div className={styles.noResults}>
            <p>Error searching for books. Please try again.</p>
          </div>
        )}

        {!isLoading && books.length > 0 && (
          <section className={styles.results}>
            <h2 className={styles.resultsTitle}>
              {isSubjectSearch
                ? `Showing ${numFound.toLocaleString()} books in ${displayTitle} — Page ${urlPage} of ${totalPages}`
                : `Found ${numFound.toLocaleString()} books for "${displayTitle}" — Page ${urlPage} of ${totalPages}`}
            </h2>
            <div className={styles.bookGrid}>
              {books.map((book) => (
                <BookCard key={book.key} book={book} onClick={setSelectedBook} />
              ))}
            </div>
            <Pagination
              currentPage={urlPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </section>
        )}

        {!isLoading && (urlQuery || isSubjectSearch) && !error && books.length === 0 && (
          <div className={styles.noResults}>
            <p>
              No books found for &quot;{displayTitle}&quot;. Try a different
              search term.
            </p>
          </div>
        )}

        {showTrending && <TrendingBooks onBookClick={setSelectedBook} />}
      </main>
      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
