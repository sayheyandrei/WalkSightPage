import { clamp, type MotionModule } from "./types";

/**
 * Final call to action: pointer X drives phone (shift + rotation), map (opposite rotation) and
 * arrow (same rotation as the map, in place). Offsets are appended to the base transforms.
 */
export function parallaxModule(): MotionModule | null {
  if (!window.matchMedia("(pointer: fine) and (hover: hover)").matches) return null;
  const section = document.querySelector<HTMLElement>("[data-final]");
  const phone = document.querySelector<HTMLElement>("[data-final-phone]");
  const map = document.querySelector<HTMLElement>("[data-final-map]");
  const arrows = [...document.querySelectorAll<HTMLElement>("[data-final-arrow]")];
  if (!section || !phone || !map) return null;

  const MAX_ROTATION = 5;
  let target = 0;
  let current = 0;
  let written = Number.NaN;
  let visible = false;
  let amplitude = 24;

  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType === "touch") return;
      target = clamp((event.clientX / window.innerWidth) * 2 - 1, -1, 1);
    },
    { passive: true },
  );
  document.documentElement.addEventListener("mouseleave", () => (target = 0), { passive: true });
  window.addEventListener("blur", () => (target = 0));

  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      const hint = visible ? "transform" : "";
      [phone, map, ...arrows].forEach((el) => (el.style.willChange = hint));
    },
    { rootMargin: "100px 0px" },
  );
  observer.observe(section);

  return {
    resize() {
      // ±20px on small desktops up to ±32px on large ones
      amplitude = clamp(window.innerWidth * 0.0167, 20, 32);
    },
    update({ dt }) {
      if (!visible) return;
      current += (target - current) * (1 - Math.exp(-dt * 5));
      if (Math.abs(target - current) < 0.0004) current = target;
      if (current === written) return;
      written = current;
      const rotation = current * MAX_ROTATION;
      const counter = -rotation;
      phone.style.transform = `translate(-50%, -50%) translate3d(${(current * amplitude).toFixed(2)}px, 0, 0) rotate(${rotation.toFixed(3)}deg)`;
      map.style.transform = `translateX(-50%) rotate(${counter.toFixed(3)}deg)`;
      for (const arrow of arrows) arrow.style.transform = `translate(-50%, -50%) rotate(${counter.toFixed(3)}deg)`;
    },
  };
}
