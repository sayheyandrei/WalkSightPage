import type { MotionModule } from "./types";

/**
 * The one real header element. It keeps its natural place until it reaches the sticky
 * position, then becomes position: fixed at exactly that spot, so there is no swap, fade or jump.
 * A slot of the same height keeps the hero layout from collapsing.
 */
export function headerModule(): MotionModule | null {
  const slot = document.querySelector<HTMLElement>("[data-header-slot]");
  const header = document.getElementById("site-header");
  if (!slot || !header) return null;
  const root = document.documentElement;
  let stickAt = 0;
  let fixed = false;

  const setFixed = (value: boolean) => {
    fixed = value;
    header.classList.toggle("is-fixed", value);
    root.classList.toggle("is-stuck", value);
  };

  return {
    resize() {
      const wasFixed = fixed;
      header.classList.remove("is-fixed");
      slot.style.height = "";
      const height = header.offsetHeight;
      slot.style.height = `${height}px`;
      const stickyTop = parseFloat(getComputedStyle(root).getPropertyValue("--sticky-top")) || 0;
      stickAt = slot.getBoundingClientRect().top + window.scrollY - stickyTop;
      header.classList.toggle("is-fixed", wasFixed);
    },
    update({ scroll }) {
      const want = scroll >= stickAt && scroll > 0;
      if (want !== fixed) setFixed(want);
    },
  };
}
