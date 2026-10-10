import { clamp, docTop, type MotionModule } from "./types";

/**
 * Colours the browser chrome (status bar / toolbar via <meta name="theme-color">) like the page
 * surface at the top edge of the viewport: hero, then the page background, then the inverse
 * section. Everything follows the selected theme tokens.
 */
export function chromeModule(): MotionModule | null {
  const meta = document.getElementById("meta-theme-color");
  const hero = document.querySelector<HTMLElement>(".hero");
  const curve = document.querySelector<HTMLElement>("[data-curve]");
  if (!meta || !hero) return null;
  const root = document.documentElement;
  let heroBottom = 0;
  let curveTop = 0;
  let curveHeight = 0;
  let theme = "";
  let colors = { hero: "", page: "", inverse: "" };
  let last = "";

  const readColors = () => {
    const css = getComputedStyle(root);
    colors = {
      hero: css.getPropertyValue("--hero-background").trim(),
      page: css.getPropertyValue("--background").trim(),
      inverse: css.getPropertyValue("--inverse-background").trim(),
    };
    theme = root.dataset.theme ?? "";
    last = "";
  };

  return {
    resize() {
      readColors();
      heroBottom = docTop(hero) + hero.offsetHeight;
      if (curve) {
        curveTop = docTop(curve);
        curveHeight = curve.offsetHeight;
      }
    },
    update({ scroll, vh }) {
      if (root.dataset.theme !== theme) readColors();
      let color = colors.page;
      if (scroll < heroBottom) color = colors.hero;
      else if (curve) {
        const depth = clamp((vh - (curveTop - scroll)) / (vh * 0.75));
        if (scroll >= curveTop + curveHeight * 0.41 * depth) color = colors.inverse;
      }
      if (color && color !== last) {
        last = color;
        meta.setAttribute("content", color);
      }
    },
  };
}
