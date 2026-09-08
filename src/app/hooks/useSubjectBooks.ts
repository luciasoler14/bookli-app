import { useQuery, keepPreviousData } from "@tanstack/react-query";
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

const BOOKS_PER_PAGE = 20;

// El endpoint /subjects/*.json de Open Library es lento y falla seguido.
// El Search API con ?subject= es mucho más estable. Espera el subject como
// slug con guiones bajos y en minúscula (ej. "young adult" -> "young_adult").
function toSubjectSlug(subject: string): string {
  const aliases: Record<string, string> = {
    "sci-fi": "science_fiction",
    children: "juvenile_fiction",
  };
  const normalized = subject.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return aliases[normalized] ?? normalized;
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

async function fetchSubjectBooks(
  subject: string,
  page: number
): Promise<{ books: Book[]; numFound: number }> {
  const offset = (page - 1) * BOOKS_PER_PAGE;
  const params = new URLSearchParams({
    subject: toSubjectSlug(subject),
    limit: String(BOOKS_PER_PAGE),
    offset: String(offset),
    fields: "key,title,author_name,first_publish_year,cover_i",
  });
  const res = await fetch(`https://openlibrary.org/search.json?${params}`);
  if (!res.ok) throw new Error("Failed to fetch subject books");
  const data: SearchResponse = await res.json();
  return {
    books: data.docs.map(mapDocToBook),
    numFound: data.numFound,
  };
}

export function useSubjectBooks(subject: string | null, page: number) {
  return useQuery({
    queryKey: ["subjectBooks", subject, page],
    queryFn: () => fetchSubjectBooks(subject!, page),
    enabled: !!subject,
    staleTime: 1000 * 60 * 10,
    placeholderData: keepPreviousData,
  });
}
