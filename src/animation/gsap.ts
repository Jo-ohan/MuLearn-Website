import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

gsap.defaults({ ease: 'power3.out' });

/** Shared easing curves for a consistent motion language. */
export const EASE = {
  out: 'power3.out',
  expo: 'expo.out',
  inOut: 'power3.inOut',
  film: 'power4.out',
} as const;

/** Debounced refresh — call after layout-changing events (lazy sections, images). */
let refreshTimer: number | undefined;
export const refreshScrollTriggers = () => {
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
};

export { gsap, ScrollTrigger };
