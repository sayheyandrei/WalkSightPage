import Lenis from "lenis";
import { buildModule } from "./motion/build";
import { curveModule } from "./motion/curve";
import { exploreModule } from "./motion/explore";
import { headerModule } from "./motion/header";
import { orbitModule } from "./motion/orbit";
import { parallaxModule } from "./motion/parallax";
import { cardsModule } from "./motion/cards";
import { initPointer } from "./motion/pointer";
import { initReveal } from "./motion/reveal";
import { wordsModule } from "./motion/words";
import type { Frame, MotionModule } from "./motion/types";

/**
 * Central motion layer: one Lenis instance and ONE requestAnimationFrame loop drive every
 * scroll-linked effect, so they all read the same smoothed scroll position.
 * With prefers-reduced-motion nothing is initialised except the (functional) header fixing.
 */
export function initMotion() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const modules: MotionModule[] = [];
  const add = (module: MotionModule | null) => module && modules.push(module);

  add(headerModule());

  if (!reduce) {
    try {
      initPointer();
      add(wordsModule());
      add(exploreModule());
      add(cardsModule());
      add(buildModule());
      add(curveModule());
      add(orbitModule());
      add(parallaxModule());
      initReveal();
    } catch (error) {
      console.error("Motion setup failed; showing the static page", error);
      document.documentElement.classList.remove("motion-ok");
      document.querySelectorAll("[data-words]").forEach((el) => el.classList.add("words-ready"));
    }
  }

  const frame: Frame = { scroll: window.scrollY, vw: window.innerWidth, vh: window.innerHeight, dt: 0, elapsed: 0 };
  let pending = false;

  const measure = () => {
    pending = false;
    frame.vw = window.innerWidth;
    frame.vh = window.innerHeight;
    modules.forEach((module) => module.resize());
    modules.forEach((module) => module.update(frame));
  };
  const scheduleMeasure = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(measure);
  };

  new ResizeObserver(scheduleMeasure).observe(document.body);
  window.addEventListener("resize", scheduleMeasure, { passive: true });
  window.addEventListener("load", scheduleMeasure);
  document.fonts?.ready.then(scheduleMeasure);
  measure();

  if (reduce) {
    window.addEventListener(
      "scroll",
      () => {
        frame.scroll = window.scrollY;
        modules.forEach((module) => module.update(frame));
      },
      { passive: true },
    );
    return;
  }

  // Smooth wheel / trackpad scrolling. Touch stays native (syncTouch is off).
  const lenis = new Lenis({
    autoRaf: false,
    lerp: 0.085,
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: 1,
    touchMultiplier: 1,
  });

  let startedAt = performance.now();
  let previous = startedAt;
  const tick = (now: number) => {
    lenis.raf(now);
    frame.scroll = lenis.scroll;
    frame.dt = Math.min(0.1, (now - previous) / 1000);
    frame.elapsed = now - startedAt;
    previous = now;
    for (const module of modules) module.update(frame);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
