"use client";

import { GENRES } from "../utils/genres";
import styles from "./ExploreByGenre.module.css";

interface ExploreByGenreProps {
  onSelect: (genre: string) => void;
}

export default function ExploreByGenre({ onSelect }: ExploreByGenreProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>🧭 Explore by genre</h2>
      <div className={styles.grid}>
        {GENRES.map((genre) => (
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
