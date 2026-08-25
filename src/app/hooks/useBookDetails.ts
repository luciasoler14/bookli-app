import { useQuery } from "@tanstack/react-query";

export interface AuthorDetails {
  name?: string;
  bio?: string;
  birth_date?: string;
  death_date?: string;
  wikipedia?: string;
}

interface BookDetails {
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

  return {
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
