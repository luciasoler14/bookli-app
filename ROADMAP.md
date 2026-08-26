# Bookli - Roadmap

Mejoras pendientes, ordenadas por prioridad.

---

## Alta prioridad (core UX)

- [x] **Ruta dedicada `/book/[key]`** — Página con detalle completo del libro, URL compartible. Incluye "Open in Open Library" link.
- [x] **Estado en URL** — Sincronizar `?q=python&page=2&tab=favorites` con `useSearchParams`. Búsqueda, página y tab de Library sobreviven refresh y links compartidos.
- [x] **Búsqueda por subjects** — Los genre chips deberían usar `/subjects/{subject}.json` en vez de `search.json?q=Mystery`. Resultados más precisos.
- [x] **Subject tags clickeables** — Los tags en el modal deberían buscar libros de ese subject al hacer clic.

## Media prioridad (mejoras de UX)

- [x] **Pagination en inglés** — "Anterior"/"Siguiente" → "Previous"/"Next".
- [x] **Loading skeletons** — Skeletons para trending, resultados de búsqueda y modal. Mantienen layout estable.
- [x] **Touch/swipe en trending carousel** — Soporte swipe en mobile con callback ref (sin loop infinito).
- [x] **Geist font activada** — `body` usa `--font-geist-sans`, eliminado `Geist_Mono` que no se usaba.
- [x] **Trending semanal** — Cambiado de trending por subject a `/trending/weekly.json` (trends de la semana, sin género). Título: "Trending This Week".
- [ ] **Mobile hamburger menu** — Menú responsive en el header.
- [ ] **Reading progress tracking** — Status "Reading" con input de página actual (X de Y).
- [x] **Search history** — Guardar últimas 5 búsquedas para reutilizar.

## Baja prioridad (nice-to-have)

- [ ] **Dark mode** — Toggle de tema claro/oscuro.
- [ ] **Notas/ratings personales** — Estrellas y notas en la library.
- [ ] **Exportar favoritos** — CSV o JSON.
- [ ] **"Libros similares"** en el modal.
- [ ] **Image optimization** — Configurar `next.config.ts` images.remotePatterns.
- [ ] **Accessibility** — Focus trap en modal, ARIA labels, keyboard nav en cards.
- [ ] **Error boundaries** — Retry buttons, error states más descriptivos.
- [ ] **Debounced search / autocomplete** — Búsqueda instantánea con suggestions.
- [ ] **Sortable library** — Por título, fecha, autor.
- [ ] **Confirmación al eliminar** — Undo o diálogo antes de quitar de la lista.
