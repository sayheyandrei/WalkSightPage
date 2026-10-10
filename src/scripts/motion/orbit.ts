import type { MotionModule } from "./types";

const TAU = Math.PI * 2;
const STAGE_UNITS = 1592; // the 1920 frame's stage, in which the pin coordinates were exported
const CENTER = { x: 796, y: 796.5 };
const PIN_SIZE = 72;

interface Ring {
  maxRadius: number;
  /** +1 clockwise, -1 counter-clockwise (screen space, y down). */
  direction: 1 | -1;
  period: number; // seconds per revolution
}

const RINGS: Ring[] = [
  { maxRadius: 500, direction: 1, period: 80 }, // inner
  { maxRadius: 700, direction: -1, period: 120 }, // middle
  { maxRadius: Infinity, direction: 1, period: 160 }, // outer
];

/**
 * Pins travel along the rings they already sit on. Positions come from angle + radius, so the
 * icons are translated only and never rotate. The rings and phone are not touched.
 */
export function orbitModule(): MotionModule | null {
  const stage = document.querySelector<HTMLElement>("[data-orbit-stage]");
  if (!stage) return null;
  const pins = [...stage.querySelectorAll<HTMLElement>("[data-pin-x]")].map((el) => {
    const dx = Number(el.dataset.pinX) + PIN_SIZE / 2 - CENTER.x;
    const dy = Number(el.dataset.pinY) + PIN_SIZE / 2 - CENTER.y;
    const radius = Math.hypot(dx, dy);
    const ring = RINGS.find((r) => radius < r.maxRadius)!;
    return { el, dx, dy, radius, angle: Math.atan2(dy, dx), ring };
  });

  let scale = 1;
  let visible = false;
  let startedAt: number | null = null;
  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      pins.forEach((pin) => (pin.el.style.willChange = visible ? "transform" : ""));
    },
    { rootMargin: "300px 0px" },
  );
  observer.observe(stage);

  return {
    resize() {
      scale = stage.offsetWidth / STAGE_UNITS;
    },
    update({ elapsed }) {
      if (!visible) return;
      if (startedAt === null) startedAt = elapsed;
      const seconds = (elapsed - startedAt) / 1000;
      for (const pin of pins) {
        const theta = pin.angle + (pin.ring.direction * TAU * seconds) / pin.ring.period;
        const x = (pin.radius * Math.cos(theta) - pin.dx) * scale;
        const y = (pin.radius * Math.sin(theta) - pin.dy) * scale;
        pin.el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      }
    },
  };
}
