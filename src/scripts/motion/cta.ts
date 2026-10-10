/**
 * The mobile floating Download button must not show while an in-content Download CTA is on
 * screen. A Set tracks the CTAs currently intersecting the viewport; CSS shows the floating
 * button only when the header is fixed (html.is-stuck) and html.cta-in-view is absent.
 */
export function initCtaVisibility() {
  const ctas = [...document.querySelectorAll<HTMLElement>("[data-download-app]")].filter(
    (el) => !el.classList.contains("btn--float") && !el.classList.contains("btn--compact"),
  );
  if (!ctas.length || !("IntersectionObserver" in window)) return;
  const root = document.documentElement;
  const visible = new Set<Element>();
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    }
    root.classList.toggle("cta-in-view", visible.size > 0);
  });
  ctas.forEach((el) => observer.observe(el));
}
