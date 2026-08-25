import { useQuery } from "@tanstack/react-query";

interface BookDetails {
  description?: string;
  subjects?: string[];
  number_of_pages_median?: number;
  first_publish_date?: string;
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

  return {
    description,
    subjects: data.subjects,
    number_of_pages_median: data.number_of_pages_median,
    first_publish_date: data.first_publish_date,
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
