import styles from "./Skeleton.module.css";

function Bone({ className }: { className?: string }) {
  return <div className={`${styles.bone} ${className ?? ""}`} />;
}

export function BookCardSkeleton() {
  return (
    <div className={styles.bookCard}>
      <Bone className={styles.bookCover} />
      <Bone className={styles.bookTitle} />
      <Bone className={styles.bookAuthor} />
      <Bone className={styles.bookYear} />
    </div>
  );
}

export function TrendingSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div style={{ display: "flex", gap: "1rem", overflow: "hidden" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ flex: "0 0 180px", minWidth: "180px" }}>
          <BookCardSkeleton />
        </div>
      ))}
    </div>
  );
}

export function SearchResultsSkeleton({ count = 20 }: { count?: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.5rem" }}>
      {Array.from({ length: count }).map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ModalSkeleton() {
  return (
    <div style={{ display: "flex", gap: "2rem", padding: "2rem" }}>
      <Bone className={styles.modalCover} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <Bone className={styles.modalTitle} />
        <Bone className={styles.modalAuthor} />
        <Bone className={styles.modalLine} />
        <Bone className={styles.modalLineShort} />
        <Bone className={styles.modalLine} />
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
          <Bone className={styles.modalTag} />
          <Bone className={styles.modalTag} />
          <Bone className={styles.modalTag} />
        </div>
        <div className={styles.modalActions}>
          <Bone className={styles.modalBtn} />
          <Bone className={styles.modalBtn} />
          <Bone className={styles.modalBtn} />
        </div>
      </div>
    </div>
  );
}
