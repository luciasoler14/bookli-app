import { useQuery } from "@tanstack/react-query";
import { Book } from "../components/BookCard";

interface SearchResponse {
  docs: Book[];
  numFound: number;
}

async function fetchBooks(query: string): Promise<SearchResponse> {
  const res = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20`
  );
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
}

export function useBooks(query: string, enabled: boolean) {
  return useQuery({
    queryKey: ["books", query],
    queryFn: () => fetchBooks(query),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
