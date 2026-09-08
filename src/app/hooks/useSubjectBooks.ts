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

const BOOKS_PER_PAGE = 20;

async function fetchSubjectBooks(
  subject: string,
  page: number,
): Promise<{ books: Book[]; numFound: number }> {
  const offset = (page - 1) * BOOKS_PER_PAGE;
  const res = await fetch(
    `https://openlibrary.org/subjects/${subject}.json?limit=${BOOKS_PER_PAGE}&offset=${offset}`,
  );

  if (!res.ok) throw new Error("Failed to fetch subject books");
  const data: SubjectResponse = await res.json();
  return {
    books: data.works.map(mapWorkToBook),
    numFound: data.work_count,
  };
}

export function useSubjectBooks(subject: string | null, page: number) {
  return useQuery({
    queryKey: ["subjectBooks", subject, page],
    queryFn: () => fetchSubjectBooks(subject!, page),
    enabled: !!subject,
    staleTime: 1000 * 60 * 10,
  });
}
