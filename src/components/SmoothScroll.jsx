import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { scrollToTarget, setLenis } from '../lib/scroll';

const POSITIONS_KEY = 'symmetry_scroll_positions';

// Every fresh page load gets the history key "default", so for those the URL is part of the key.
// On the first render a saved position is only used if the browser says this is a reload or Back/Forward.
const entryKey = (location) =>
  location.key === 'default' ? `default:${location.pathname}${location.search}` : location.key;

const isReturnVisit = () => {
  const type = performance.getEntriesByType?.('navigation')[0]?.type;
  return type === 'reload' || type === 'back_forward';
};

const readPositions = () => {
  try {
    return JSON.parse(sessionStorage.getItem(POSITIONS_KEY)) || {};
  } catch {
    return {};
  }
};

/**
 * Owns page scrolling for the public site:
 * - Smooths the mouse wheel only (Lenis). Touch keeps the phone's own scrolling, and
 *   people who ask for reduced motion get plain native scrolling.
 * - New page → top. Back/Forward → the position you left it at (once the page is tall enough).
 * - Links to #anchors, on this page or another, glide to the target below the header.
 * Everything else scrolls through src/lib/scroll.js.
 */
export const SmoothScroll = ({ children }) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const positions = useRef(null);
  if (positions.current === null) positions.current = readPositions(); // also restores after a reload
  const currentKey = useRef(entryKey(location));
  const lastPath = useRef(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;

    const lenis = new Lenis({
      lerp: 0.1, // each frame covers 10% of the remaining distance: soft, never sluggish
      smoothWheel: true,
      syncTouch: false, // touch scrolling stays native
      autoRaf: true,
    });
    setLenis(lenis);
    window.lenis = lenis;

    return () => {
      lenis.destroy();
      setLenis(null);
      window.lenis = null;
    };
  }, []);

  // Remember where each history entry was scrolled to
  useEffect(() => {
    let frame = 0;
    const save = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        positions.current[currentKey.current] = Math.round(window.scrollY);
      });
    };
    const persist = () => {
      try {
        // Keep the 50 most recent entries
        const entries = Object.entries(positions.current).slice(-50);
        sessionStorage.setItem(POSITIONS_KEY, JSON.stringify(Object.fromEntries(entries)));
      } catch {
        // Storage blocked: positions still work until the tab is reloaded
      }
    };
    window.addEventListener('scroll', save, { passive: true });
    window.addEventListener('pagehide', persist);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', save);
      window.removeEventListener('pagehide', persist);
      persist();
    };
  }, []);

  // Runs before the browser paints the new page, so the old position is never shown on it
  useLayoutEffect(() => {
    const key = entryKey(location);
    currentKey.current = key;
    const freshLoad = firstRender.current && !isReturnVisit();
    firstRender.current = false;
    const saved = freshLoad ? undefined : positions.current[key];
    const samePage = lastPath.current === location.pathname;
    lastPath.current = location.pathname;

    // Pages load lazily and fill in from the API: wait until the target exists or the page is tall enough
    let frame = 0;
    const started = performance.now();
    const waitFor = (ready, then) => {
      const tick = () => {
        if (ready() || performance.now() - started > 2000) then();
        else frame = requestAnimationFrame(tick);
      };
      tick();
    };

    if (navigationType === 'POP' && saved != null) {
      waitFor(
        () => document.documentElement.scrollHeight - window.innerHeight >= saved,
        () => scrollToTarget(saved, { immediate: true }),
      );
    } else if (location.hash) {
      if (!samePage) scrollToTarget(0, { immediate: true });
      waitFor(
        () => {
          try {
            return document.querySelector(location.hash);
          } catch {
            return true; // not a valid selector: stop waiting
          }
        },
        () => {
          try {
            scrollToTarget(location.hash);
          } catch {
            // Invalid selector
          }
        },
      );
    } else if (!samePage) {
      // Same page with a new query (Shop filters write to the URL) keeps its position
      scrollToTarget(0, { immediate: true });
    }
    return () => cancelAnimationFrame(frame);
  }, [location.key]); // eslint-disable-line react-hooks/exhaustive-deps

  // Same-page anchor links glide instead of jumping
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = e.target.closest('a[href*="#"]');
      if (!anchor || anchor.target === '_blank') return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;
      if (url.hash.length <= 1) return;
      let target = null;
      try {
        target = document.querySelector(url.hash);
      } catch {
        return;
      }
      if (!target) return;
      e.preventDefault();
      window.history.pushState(window.history.state, '', url.hash);
      scrollToTarget(target);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
