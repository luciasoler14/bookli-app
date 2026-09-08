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

export function BookDetailSkeleton() {
  return (
    <div style={{ display: "flex", gap: "3rem" }}>
      <Bone className={styles.detailCover} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <Bone className={styles.detailTitle} />
        <Bone className={styles.detailAuthor} />
        <Bone className={styles.detailLine} />
        <Bone className={styles.detailLineShort} />
        <Bone className={styles.detailLine} />
        <div style={{ marginTop: "2rem" }}>
          <Bone className={styles.detailSectionTitle} />
          <Bone className={styles.detailLine} />
          <Bone className={styles.detailLine} />
          <Bone className={styles.detailLineShort} />
        </div>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
          <Bone className={styles.modalTag} />
          <Bone className={styles.modalTag} />
          <Bone className={styles.modalTag} />
        </div>
        <div className={styles.detailActions}>
          <Bone className={styles.detailBtn} />
          <Bone className={styles.detailBtn} />
        </div>
      </div>
    </div>
  );
}
