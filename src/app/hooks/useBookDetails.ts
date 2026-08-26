import { useQuery } from "@tanstack/react-query";

export interface AuthorDetails {
  name?: string;
  bio?: string;
  birth_date?: string;
  death_date?: string;
  wikipedia?: string;
}

interface BookDetails {
  book?: {
    key: string;
    title: string;
    author_name?: string[];
    first_publish_year?: number;
    cover_i?: number;
    publisher?: string[];
    language?: string[];
  };
  description?: string;
  subjects?: string[];
  number_of_pages_median?: number;
  first_publish_date?: string;
  authors?: AuthorDetails[];
}

async function fetchAuthor(key: string): Promise<AuthorDetails> {
  const res = await fetch(`https://openlibrary.org${key}.json`);
  if (!res.ok) return {};
  const data = await res.json();
  let bio: string | undefined;
  if (typeof data.bio === "string") {
    bio = data.bio;
  } else if (data.bio?.value) {
    bio = data.bio.value;
  }
  return {
    name: data.name,
    bio,
    birth_date: data.birth_date,
    death_date: data.death_date,
    wikipedia: data.wikipedia,
  };
}

async function fetchBookDetails(key: string): Promise<BookDetails> {
  const res = await fetch(`https://openlibrary.org${key}.json`);
  if (!res.ok) throw new Error("Failed to fetch book details");
  const data = await res.json();

  let description: string | undefined;
  if (typeof data.description === "string") {
    description = data.description;
  } else if (data.description?.value) {
    description = data.description.value;
  }

  const authorKeys: string[] =
    data.authors?.map((a: { author: { key: string } }) => a.author?.key).filter(Boolean) || [];

  const authors = await Promise.all(authorKeys.slice(0, 3).map(fetchAuthor));

  const authorNames = authors.map((a) => a.name).filter(Boolean) as string[];

  let cover_i: number | undefined;
  let publisher: string[] | undefined;
  let language: string[] | undefined;
  let first_publish_year: number | undefined;

  try {
    const editionsRes = await fetch(
      `https://openlibrary.org${key}/editions.json?limit=1`
    );
    if (editionsRes.ok) {
      const editionsData = await editionsRes.json();
      const edition = editionsData.entries?.[0];
      if (edition) {
        cover_i = edition.covers?.[0];
        publisher = edition.publishers;
        language = edition.languages?.map((l: { key: string }) =>
          l.key.replace("/languages/", "")
        );
        first_publish_year = edition.first_publish_year;
      }
    }
  } catch {
    // editions fetch is optional
  }

  return {
    book: {
      key,
      title: data.title,
      author_name: authorNames.length > 0 ? authorNames : undefined,
      first_publish_year: first_publish_year || data.first_publish_year,
      cover_i,
      publisher,
      language,
    },
    description,
    subjects: data.subjects,
    number_of_pages_median: data.number_of_pages_median,
    first_publish_date: data.first_publish_date,
    authors,
  };
}

export function useBookDetails(key: string | null) {
  return useQuery({
    queryKey: ["bookDetails", key],
    queryFn: () => fetchBookDetails(key!),
    enabled: !!key,
    staleTime: 1000 * 60 * 10,
  });
}
