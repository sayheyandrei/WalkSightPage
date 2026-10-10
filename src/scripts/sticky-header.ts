/**
 * Reveals the dedicated sticky header once the initial header has scrolled out
 * of view. An IntersectionObserver watches the real header element, so there
 * are no scroll-position magic numbers. The sticky header is fixed, so showing
 * it never shifts the layout.
 */
export function initStickyHeader() {
  const header = document.getElementById("site-header");
  const root = document.documentElement;
  if (!header || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      const scrolledPast = !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
      root.classList.toggle("is-stuck", scrolledPast);
    },
    { threshold: 0 },
  );
  observer.observe(header);
}
