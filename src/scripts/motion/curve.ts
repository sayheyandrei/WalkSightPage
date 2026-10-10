import { clamp, docTop, type MotionModule } from "./types";

/** White-to-dark transition: depth goes from a straight line (0) to the exact Figma curve (1). */
export function curveModule(): MotionModule | null {
  const curve = document.querySelector<HTMLElement>("[data-curve]");
  const cap = document.querySelector<SVGElement>("[data-curve-cap]");
  if (!curve || !cap) return null;

  let top = 0;
  let last = -1;

  return {
    resize() {
      top = docTop(curve);
      last = -1;
    },
    update({ scroll, vh }) {
      const progress = clamp((vh - (top - scroll)) / (vh * 0.75));
      if (progress === last) return;
      last = progress;
      cap.style.transform = progress >= 1 ? "" : `scaleY(${progress.toFixed(4)})`;
    },
  };
}
