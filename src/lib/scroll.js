import { useEffect } from 'react';

/**
 * The one way the public site scrolls the page or stops it from scrolling.
 * <SmoothScroll> registers its Lenis instance here; without one (reduced motion,
 * admin pages) the same calls fall back to native scrolling.
 *
 *   scrollToTarget('#process')        element, selector, or a number of pixels
 *   scrollToTarget(el, { offset: 0 }) override the gap left for the header
 *   useScrollLock(isOpen)             in any popup that covers the page
 */

let lenis = null;
// Several popups can be open at once (search over the mobile menu), so locks are counted
let locks = 0;

export const setLenis = (instance) => {
  lenis = instance;
  if (lenis && locks > 0) lenis.stop(); // a popup or the intro locked scrolling before Lenis started
};
export const getLenis = () => lenis;

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Space left above a scrolled-to element so the fixed header doesn't cover it */
export const headerOffset = () => (document.querySelector('[data-site-header]')?.offsetHeight ?? 64) + 16;

const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export const scrollToTarget = (target, { offset, immediate = false } = {}) => {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (el == null) return;
  const isNumber = typeof el === 'number';
  // An element with its own scroll-margin-top (Tailwind scroll-mt-*) keeps it instead of the header gap
  const margin = isNumber ? 0 : parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  const gap = isNumber ? 0 : offset ?? (margin || headerOffset());
  const instant = immediate || reducedMotion();

  if (lenis) {
    lenis.resize(); // the page may have just grown (lazy page, API content): measure before clamping
    const lenisOffset = -(gap - margin); // Lenis already subtracts scroll-margin-top itself
    // Photos above the target may still be loading and push it down mid-glide: correct once at the end
    const settle = () => {
      if (isNumber || !el.isConnected) return;
      if (Math.abs(el.getBoundingClientRect().top - gap) > 4) {
        lenis.scrollTo(el, { offset: lenisOffset, duration: 0.4, easing: easeOutExpo, force: true });
      }
    };
    lenis.scrollTo(el, { offset: lenisOffset, immediate: instant, duration: 1.1, easing: easeOutExpo, force: true, onComplete: settle });
    return;
  }
  const top = typeof el === 'number' ? el : el.getBoundingClientRect().top + window.scrollY - gap;
  window.scrollTo({ top, behavior: instant ? 'auto' : 'smooth' });
};

export const lockScroll = () => {
  if (locks++ > 0) return;
  lenis?.stop();
  document.documentElement.style.overflow = 'hidden';
};

export const unlockScroll = () => {
  if (locks === 0 || --locks > 0) return;
  document.documentElement.style.overflow = '';
  lenis?.start();
};

/** Stop the page behind a popup from scrolling while `active` is true */
export const useScrollLock = (active) => {
  useEffect(() => {
    if (!active) return undefined;
    lockScroll();
    return unlockScroll;
  }, [active]);
};
