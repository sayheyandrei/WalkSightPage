import { clamp, docTop, type MotionModule } from "./types";

/** "Build a walk": map + arrow rotate together from -10deg to +10deg around their designed angle. */
export function buildModule(): MotionModule | null {
  const art = document.querySelector<HTMLElement>("[data-build-art]");
  const spin = document.querySelector<HTMLElement>("[data-build-spin]");
  if (!art || !spin) return null;

  let top = 0;
  let height = 0;
  let last = Number.NaN;

  return {
    resize() {
      top = docTop(art);
      height = art.offsetHeight;
      last = Number.NaN;
    },
    update({ scroll, vh }) {
      const progress = clamp((vh - (top - scroll)) / (vh + height));
      const angle = Math.round((progress - 0.5) * 20 * 1000) / 1000;
      if (angle === last) return;
      last = angle;
      const active = progress > 0 && progress < 1;
      spin.style.willChange = active ? "transform" : "";
      spin.style.transform = `rotate(${angle}deg)`;
    },
  };
}
