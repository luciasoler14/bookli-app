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

function mapWorkToBook(work: SubjectWork): Book {
  return {
    key: work.key,
    title: work.title,
    author_name: work.authors?.map((a) => a.name),
    first_publish_year: work.first_publish_year,
    cover_i: work.cover_id,
  };
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

async function fetchSubjectBooks(
  subject: string,
  page: number,
): Promise<{ books: Book[]; numFound: number; useSearch: boolean }> {
  // Primera intención: API de subjects (filtrado por etiqueta oficial)
  const offset = (page - 1) * BOOKS_PER_PAGE;
  const subjectsRes = await fetch(
    `https://openlibrary.org/subjects/${subject}.json?limit=${BOOKS_PER_PAGE}&offset=${offset}`,
  );

  let books: Book[] = [];
  let numFound: number = 0;
  let useSearch = false;

  if (!subjectsRes.ok) {
    // Si el API falla, ir directo a search
    useSearch = true;
  } else {
    const data: SubjectResponse = await subjectsRes.json();
    books = data.works.map(mapWorkToBook);
    numFound = data.work_count;

    // Si no hay resultados, hacer fallback a search
    if (numFound === 0) {
      useSearch = true;
    }
  }

  // Fallback a search si no hay results de subjects
  if (useSearch) {
    const limit = 20;
    const offset = (page - 1) * limit;
    const searchRes = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(subject)}&limit=${limit}&offset=${offset}`,
    );
    if (searchRes.ok) {
      const data: SearchResponse = await searchRes.json();
      books = data.docs.map(mapDocToBook);
      numFound = data.numFound;
    }
  }

  return { books, numFound, useSearch };
}

export function useSubjectBooks(subject: string | null, page: number) {
  return useQuery({
    queryKey: ["subjectBooks", subject, page],
    queryFn: () => fetchSubjectBooks(subject!, page),
    enabled: !!subject,
    staleTime: 1000 * 60 * 10,
  });
}
