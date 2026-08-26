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

const CACHE_KEY = "bookli_trending_cache";
const CACHE_TTL = 1000 * 60 * 60;

function mapWorkToBook(work: TrendingWork): Book {
  return {
    key: work.key,
    title: work.title,
    author_name: work.author_name,
    first_publish_year: work.first_publish_year,
    cover_i: work.cover_i,
  };
}

function readCache(): Book[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function writeCache(data: Book[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

async function fetchTrending(): Promise<Book[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch("https://openlibrary.org/trending/weekly.json", {
      signal: controller.signal,
    });
    if (!res.ok) throw new Error("Failed to fetch trending books");
    const data: TrendingResponse = await res.json();
    return data.works.map(mapWorkToBook);
  } finally {
    clearTimeout(timeout);
  }
}

export function useTrending(limit = 6) {
  return useQuery({
    queryKey: ["trending"],
    queryFn: async () => {
      const cached = readCache();
      if (cached) return cached.slice(0, limit);

      const books = await fetchTrending();
      writeCache(books);
      return books.slice(0, limit);
    },
    staleTime: CACHE_TTL,
    gcTime: CACHE_TTL,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
