"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import styles from "./Header.module.css";

const emptySubscribe = () => () => {};

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

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
          <button
            type="button"
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={
              mounted && theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            title={mounted && theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {mounted && theme === "dark" ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
