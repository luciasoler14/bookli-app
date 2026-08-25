"use client";

import styles from "./ExploreByGenre.module.css";

const genres = [
  "Mystery",
  "Thriller",
  "Fantasy",
  "Romance",
  "Sci-Fi",
  "Horror",
  "History",
  "Biography",
  "Fiction",
];

interface ExploreByGenreProps {
  onSelect: (genre: string) => void;
}

export default function ExploreByGenre({ onSelect }: ExploreByGenreProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>🧭 Explore by genre</h2>
      <div className={styles.grid}>
        {genres.map((genre) => (
          <button
            key={genre}
            className={styles.chip}
            onClick={() => onSelect(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </section>
  );
}
