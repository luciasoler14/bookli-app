import { useQuery } from "@tanstack/react-query";
import { Book } from "../components/BookCard";

interface SubjectWork {
  key: string;
  title: string;
  authors?: { name: string; key: string }[];
  cover_id?: number;
  first_publish_year?: number;
}

interface SubjectResponse {
  works: SubjectWork[];
  work_count: number;
}

function mapWorkToBook(work: SubjectWork): Book {
  return {
    key: work.key,
    title: work.title,
    author_name: work.authors?.map((a) => a.name),
    first_publish_year: work.first_publish_year,
    cover_i: work.cover_id,
  };
}

async function fetchTrending(subject: string, limit: number): Promise<Book[]> {
  const res = await fetch(
    `https://openlibrary.org/subjects/${subject}.json?limit=${limit}`
  );
  if (!res.ok) throw new Error("Failed to fetch trending books");
  const data: SubjectResponse = await res.json();
  return data.works.map(mapWorkToBook);
}

export function useTrending(subject = "fiction", limit = 6) {
  return useQuery({
    queryKey: ["trending", subject, limit],
    queryFn: () => fetchTrending(subject, limit),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
