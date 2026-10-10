import { docTop, type MotionModule } from "./types";

/**
 * Describes the page's vertical colour bands to the browser. Mobile browsers tint their status bar
 * and bottom toolbar from the page background at the viewport edges, so the body background is a
 * map of what is really there: hero colour, page colour, then the inverse (contrast) colour. That
 * keeps the top bar hero-coloured and the bottom bar the contrast colour, seamlessly, in any theme.
 */
export function chromeModule(): MotionModule | null {
  const hero = document.querySelector<HTMLElement>(".hero");
  const final = document.querySelector<HTMLElement>("[data-final]");
  if (!hero) return null;
  const root = document.documentElement;

  return {
    resize() {
      root.style.setProperty("--surface-hero-end", `${Math.round(docTop(hero) + hero.offsetHeight)}px`);
      if (final) root.style.setProperty("--surface-inverse-start", `${Math.floor(docTop(final)) - 1}px`);
    },
    update() {},
  };
}
