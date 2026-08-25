import { useQuery } from "@tanstack/react-query";
import { Book } from "../components/BookCard";

interface SearchResponse {
  docs: Book[];
  numFound: number;
}

async function fetchBooks(
  query: string,
  page: number,
): Promise<SearchResponse> {
  const limit = 20;
  const res = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}&page=${page}`,
  );
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
}

export function useBooks(query: string, page: number, enabled: boolean) {
  return useQuery({
    queryKey: ["books", query, page],
    queryFn: () => fetchBooks(query, page),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
