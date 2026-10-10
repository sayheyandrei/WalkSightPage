import { clamp, docTop, type MotionModule } from "./types";

/**
 * The one real header element. It keeps its natural place until it reaches the sticky
 * position, then becomes position: fixed at exactly that spot, so there is no swap, fade or jump.
 * A slot of the same height keeps the hero layout from collapsing.
 *
 * Local skin: while the fixed header physically sits over the inverse (contrast) surface it gets
 * `.is-on-inverse`. That only restyles the header; html[data-theme] and the selected sun/moon
 * button are never changed. The boundary is the real geometry of the transition curve (the
 * point where the dark surface reaches the header's centre line), with 2px hysteresis.
 */
export function headerModule(): MotionModule | null {
  const slot = document.querySelector<HTMLElement>("[data-header-slot]");
  const header = document.getElementById("site-header");
  if (!slot || !header) return null;
  const root = document.documentElement;
  const curve = document.querySelector<HTMLElement>("[data-curve]");
  let stickAt = 0;
  let fixed = false;
  let onInverse = false;
  let headerHeight = 0;
  let stickyTop = 0;
  let curveTop = 0;
  let curveHeight = 0;

  const setFixed = (value: boolean) => {
    fixed = value;
    header.classList.toggle("is-fixed", value);
    root.classList.toggle("is-stuck", value);
  };

  return {
    resize() {
      const wasFixed = fixed;
      header.classList.remove("is-fixed");
      slot.style.height = "";
      headerHeight = header.offsetHeight;
      slot.style.height = `${headerHeight}px`;
      header.classList.add("is-fixed"); // resolves the real fixed `top` (including any safe-area inset)
      stickyTop = parseFloat(getComputedStyle(header).top) || 0;
      header.classList.remove("is-fixed");
      if (curve) {
        curveTop = docTop(curve);
        curveHeight = curve.offsetHeight;
      }
      stickAt = slot.getBoundingClientRect().top + window.scrollY - stickyTop;
      header.classList.toggle("is-fixed", wasFixed);
    },
    update({ scroll, vh }) {
      const want = scroll >= stickAt && scroll > 0;
      if (want !== fixed) setFixed(want);

      let inverse = false;
      if (fixed && curve) {
        const viewportCurveTop = curveTop - scroll;
        const depth = clamp((vh - viewportCurveTop) / (vh * 0.75)); // same progress as the curve morph
        const boundary = viewportCurveTop + curveHeight * 0.41 * depth;
        const center = stickyTop + headerHeight / 2;
        inverse = center >= boundary + (onInverse ? -2 : 2);
      }
      if (inverse !== onInverse) {
        onInverse = inverse;
        header.classList.toggle("is-on-inverse", inverse);
      }
    },
  };
}
