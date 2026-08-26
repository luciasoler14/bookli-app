import { useQuery } from "@tanstack/react-query";
import { Book } from "../components/BookCard";

interface TrendingWork {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
}

interface TrendingResponse {
  works: TrendingWork[];
}

function mapWorkToBook(work: TrendingWork): Book {
  return {
    key: work.key,
    title: work.title,
    author_name: work.author_name,
    first_publish_year: work.first_publish_year,
    cover_i: work.cover_i,
  };
}

async function fetchTrending(): Promise<Book[]> {
  const res = await fetch("https://openlibrary.org/trending/weekly.json");
  
  if (!res.ok) throw new Error("Failed to fetch trending books");
  const data: TrendingResponse = await res.json();
  return data.works.map(mapWorkToBook);
}

export function useTrending(limit = 6) {
  return useQuery({
    queryKey: ["trending"],
    queryFn: async () => {
      const books = await fetchTrending();
      return books.slice(0, limit);
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
