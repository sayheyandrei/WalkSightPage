import { clamp, type MotionModule } from "./types";
import { follow, pointer } from "./pointer";

/**
 * First (hero) phone.
 *  - outer wrapper: scroll-linked rise from below into the Figma position (exactly 0 at the end)
 *  - inner wrapper: pointer parallax in the OPPOSITE direction of the cursor (translateX + rotate)
 * Two wrappers, so the two transforms compose instead of overwriting each other.
 */
export function heroModule(): MotionModule | null {
  const lift = document.querySelector<HTMLElement>("[data-hero-phone]");
  const tilt = document.querySelector<HTMLElement>("[data-hero-tilt]");
  if (!lift || !tilt) return null;

  const MAX_ROTATION = 5;
  let phoneHeight = 800;
  let range = 400;
  let amplitude = 20;
  let lastProgress = -1;
  let current = 0;
  let written = Number.NaN;
  let visible = true;

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    tilt.style.willChange = visible && pointer.fine ? "transform" : "";
  }).observe(lift);

  return {
    resize() {
      phoneHeight = lift.querySelector<HTMLElement>(".phone")?.offsetHeight ?? 800;
      range = window.innerHeight * 0.5;
      // ±16px on small desktops up to ±28px at 1920
      amplitude = clamp(window.innerWidth * 0.0145, 16, 28);
      lastProgress = -1;
    },
    update({ scroll, dt }) {
      const progress = clamp(scroll / range);
      if (progress !== lastProgress) {
        lastProgress = progress;
        if (progress >= 1) lift.style.transform = "";
        else lift.style.transform = `translate3d(0, ${(phoneHeight * 0.14 * (1 - progress)).toFixed(2)}px, 0)`;
      }
      if (!pointer.fine || !visible) return;
      current = follow(current, pointer.nx, dt);
      if (current === written) return;
      written = current;
      // inverse of the cursor: cursor right -> phone left and rotated counter-clockwise
      tilt.style.transform = current
        ? `translate3d(${(-current * amplitude).toFixed(2)}px, 0, 0) rotate(${(-current * MAX_ROTATION).toFixed(3)}deg)`
        : "";
    },
  };
}
