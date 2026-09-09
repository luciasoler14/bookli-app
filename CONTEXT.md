# Bookli - Project Context

## Tech Stack
- **Framework:** Next.js 16.3.3 (App Router)
- **React:** 19.2.8
- **Language:** TypeScript 5
- **Package Manager:** pnpm 8.15.9
- **Data Fetching:** TanStack React Query v5
- **Client State:** Zustand 5.0.15 (with `persist` middleware → localStorage)
- **Icons:** Lucide React 1.34.0
- **Styling:** CSS Modules + CSS custom properties
- **API:** Open Library (search, works, authors, subjects, covers)

## Routes
- `/` — Home (search, trending, genre explorer) — `?q=python&page=2` or `?subject=fantasy`
- `/book/[key]` — Book detail page (full details, shareable URL)
- `/library` — My Library (favorites + reading list) — `?tab=reading`

## Architecture

```
src/app/
├── layout.tsx              — Root layout (Geist fonts, Providers, Header)
├── page.tsx                — Home page (search, trending, results, modal)
├── providers.tsx           — React Query QueryClientProvider
├── globals.css             — CSS variables (design tokens)
│
├── book/
│   └── [key]/
│       ├── page.tsx        — Book detail page (shareable URL)
│       └── page.module.css
│
├── components/
│   ├── Header.tsx          — Sticky nav: logo + Home + My Library
│   ├── BookCard.tsx        — Reusable card (cover, heart, reading dropdown)
│   ├── BookModal.tsx       — Detail modal (description, authors, subjects)
│   ├── ExploreByGenre.tsx  — Genre chip selector (9 genres)
│   ├── Pagination.tsx      — Page navigation with ellipsis
│   ├── TrendingBooks.tsx   — Horizontal carousel with arrow navigation + swipe
│   └── Skeleton.tsx        — Reusable skeleton loaders (BookCard, Trending, Search, Modal)
│
├── hooks/
│   ├── useBooks.ts         — Search query (React Query)
│   ├── useBookDetails.ts   — Book + author details (React Query)
│   ├── useTrending.ts      — Weekly trending via /trending/weekly.json (React Query)
│   ├── useSubjectBooks.ts  — Books by subject with pagination (React Query)
│   ├── useFavorites.ts     — Zustand store (persisted to localStorage)
│   ├── useReadingList.ts   — Zustand store (persisted to localStorage)
│   ├── useSearchHistory.ts — Zustand store (persisted to localStorage, max 5)
│   └── useTheme.ts         — Light/dark theme, Zustand (persisted "bookli:theme"), sets data-theme on <html>
│
├── utils/
│   ├── getCoverUrl.ts          — Open Library cover URL builder
│   ├── languages.ts            — ISO code → language name mapping (~70 codes)
│   └── withStorageDOMEvents.ts — Cross-tab sync helper for Zustand stores
│
└── library/
    ├── page.tsx            — Library page (favorites + reading list tabs)
    └── library.module.css
```

## CSS Variables (globals.css)
```css
--background: #fafafa;     --foreground: #171717;
--primary: #e63946;        --primary-hover: #c1121f;
--text: #333;              --text-light: #666;       --text-dark: #444;
--border: #e0e0e0;         --surface: #f0f0f0;       --surface-hover: #f5f5f5;
--header: #d13653;         --muted: #999;            --muted-border: #eee;
--disabled: #ccc;
```

## Key Interfaces

```ts
// BookCard.tsx
interface Book {
  key: string; title: string; author_name?: string[];
  first_publish_year?: number; cover_i?: number;
  publisher?: string[]; language?: string[];
}

// useReadingList.ts
type ReadingStatus = "want" | "reading" | "read" | "dropped";
```

## Key Decisions
- **Zustand over Context** — Switched from React Context to Zustand for simpler shared state, no Provider needed, and built-in persist middleware
- **Zustand `persist` with `createJSONStorage`** — Uses `createJSONStorage(() => localStorage)` for proper cross-tab sync
- **`withStorageDOMEvents` helper** — Custom utility that listens for `storage` events and calls `rehydrate()` on Zustand stores, enabling real-time cross-tab synchronization
- **Lucide icons** — Replaced unicode hearts with `<Heart>` from lucide-react (fill toggled via prop)
- **getCoverUrl extracted** — Shared utility in `utils/getCoverUrl.ts` used by BookCard and BookModal
- **BookCard is fully reusable** — Has `onClick`, `extra` props; heart and reading list dropdown built-in
- **Language names** — Mapped from ISO codes to English names in `utils/languages.ts`
- **Modal fetches author details** — `useBookDetails` fetches works endpoint + up to 3 author profiles
- **All CSS uses variables** — No hardcoded hex values outside `globals.css`
- **Shareable book detail page** — `/book/[key]` route for sharing links, with "View Full Details" link from modal

## Current State
- ✅ Book search with pagination
- ✅ Trending books carousel (weekly trending, horizontal scroll with arrows + swipe)
- ✅ Genre explorer chips
- ✅ Book detail modal (description, authors, subjects, languages, ISBN) — all English labels
- ✅ Favorites (Zustand + localStorage, heart toggle on cards)
- ✅ Reading list with statuses (Want / Reading / Read)
- ✅ My Library page with tabs + status filters
- ✅ Header with active link highlighting
- ✅ Lucide Heart icon (filled/outline toggle)
- ✅ Cross-component state sync via Zustand
- ✅ CSS variables used consistently across all components
- ✅ Loading skeletons for trending, search results, and modal
- ✅ Shareable book detail page at /book/[key]

## Recommended Next Steps
Ver `ROADMAP.md` para la lista completa de mejoras pendientes.
