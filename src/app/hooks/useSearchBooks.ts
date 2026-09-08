import { useQuery } from "@tanstack/react-query";
import { Book } from "../components/BookCard";

interface SearchDoc {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
}

interface SearchResponse {
  docs: SearchDoc[];
  numFound: number;
}

function mapDocToBook(doc: SearchDoc): Book {
  return {
    key: doc.key,
    title: doc.title,
    author_name: doc.author_name,
    first_publish_year: doc.first_publish_year,
    cover_i: doc.cover_i,
  };
}

const BOOKS_PER_PAGE = 20;

async function fetchSearchBooks(
  query: string,
  page: number
): Promise<{ books: Book[]; numFound: number }> {
  const limit = 20;
  const offset = (page - 1) * limit;
  const res = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`
  );
  if (!res.ok) throw new Error("Failed to fetch search books");
  const data: SearchResponse = await res.json();
  return {
    books: data.docs.map(mapDocToBook),
    numFound: data.numFound,
  };
}

export function useSearchBooks(query: string | null, page: number) {
  return useQuery({
    queryKey: ["searchBooks", query, page],
    queryFn: () => fetchSearchBooks(query!, page),
    enabled: !!query,
    staleTime: 1000 * 60 * 5,
  });
}
