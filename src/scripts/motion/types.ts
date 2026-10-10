export interface Frame {
  /** Smoothed scroll position in px (the position actually applied to the page). */
  scroll: number;
  vw: number;
  vh: number;
  /** Seconds since the previous frame. */
  dt: number;
  /** Milliseconds since the motion loop started. */
  elapsed: number;
}

export interface MotionModule {
  /** Re-measure cached geometry (called on load, font load and resize). */
  resize(): void;
  /** Apply the state for this frame. Must only write transforms / opacity. */
  update(frame: Frame): void;
}

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

/** Document-space top of an element that is not itself being transformed. */
export const docTop = (el: Element) => el.getBoundingClientRect().top + window.scrollY;

/** Document-space top from layout offsets only, so CSS transforms (reveal, parallax) don't skew it. */
export const layoutTop = (el: HTMLElement) => {
  let y = 0;
  for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) y += node.offsetTop;
  return y;
};
