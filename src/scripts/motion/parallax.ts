import { clamp, type MotionModule } from "./types";
import { follow, pointer } from "./pointer";

/**
 * Final call to action. Two independent objects driven by the same pointer value:
 *  - phone: shifts and rotates WITH the cursor (own transform, base translate(-50%,-50%) kept)
 *  - map + arrow: one wrapper rotating the opposite way, so they can never drift apart
 */
export function parallaxModule(): MotionModule | null {
  if (!pointer.fine) return null;
  const section = document.querySelector<HTMLElement>("[data-final]");
  const phone = document.querySelector<HTMLElement>("[data-final-phone]");
  const group = document.querySelector<HTMLElement>("[data-final-map-group]");
  if (!section || !phone || !group) return null;

  const MAX_ROTATION = 5;
  let current = 0;
  let written = Number.NaN;
  let visible = false;
  let amplitude = 24;

  new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      const hint = visible ? "transform" : "";
      phone.style.willChange = hint;
      group.style.willChange = hint;
    },
    { rootMargin: "100px 0px" },
  ).observe(section);

  return {
    resize() {
      // ±20px on small desktops up to ±32px on large ones
      amplitude = clamp(window.innerWidth * 0.0167, 20, 32);
    },
    update({ dt }) {
      if (!visible) return;
      current = follow(current, pointer.nx, dt);
      if (current === written) return;
      written = current;
      const rotation = current * MAX_ROTATION;
      phone.style.transform = `translate(-50%, -50%) translate3d(${(current * amplitude).toFixed(2)}px, 0, 0) rotate(${rotation.toFixed(3)}deg)`;
      group.style.transform = `rotate(${(-rotation).toFixed(3)}deg)`;
    },
  };
}
