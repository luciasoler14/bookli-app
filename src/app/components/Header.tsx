"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          BOOKLI
        </Link>
        <nav className={styles.nav}>
          <Link
            href="/"
            className={`${styles.link} ${pathname === "/" ? styles.active : ""}`}
          >
            Home
          </Link>
          <Link
            href="/library"
            className={`${styles.link} ${pathname === "/library" ? styles.active : ""}`}
          >
            My Library
          </Link>
        </nav>
      </div>
    </header>
  );
}
