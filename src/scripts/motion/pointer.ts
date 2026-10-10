import { clamp } from "./types";

/** One shared pointer listener. nx: -1 at the left edge, 0 centre, +1 at the right edge. */
export const pointer = { nx: 0, fine: false };

let started = false;

export function initPointer() {
  if (started) return;
  started = true;
  pointer.fine = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
  if (!pointer.fine) return;
  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType === "touch") return;
      pointer.nx = clamp((event.clientX / window.innerWidth) * 2 - 1, -1, 1);
    },
    { passive: true },
  );
  const reset = () => (pointer.nx = 0);
  document.documentElement.addEventListener("mouseleave", reset, { passive: true });
  window.addEventListener("blur", reset);
}

/** Exponential smoothing toward the pointer target (soft inertia, frame-rate independent). */
export const follow = (current: number, target: number, dt: number, rate = 5) => {
  const next = current + (target - current) * (1 - Math.exp(-dt * rate));
  return Math.abs(target - next) < 0.0004 ? target : next;
};
