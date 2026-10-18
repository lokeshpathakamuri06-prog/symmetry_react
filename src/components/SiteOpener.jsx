import React, { useState, useEffect, useCallback } from 'react';
import { lockScroll, unlockScroll } from '../lib/scroll';

const SEEN_KEY = 'symmetry_intro_seen';

// Show the intro once per browser session, and never to people who ask for reduced motion
const shouldPlay = () => {
  try {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
    if (sessionStorage.getItem(SEEN_KEY)) return false;
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Storage blocked (private mode): still play, it is short
  }
  return true;
};

const REVEAL_DELAY = 60; // ms before the words start to appear
const HOLD_UNTIL = 1050; // ms after mount when the curtain starts to lift
const FADE_MS = 450;

/**
 * Short black opening curtain: "Welcome to SYMMETRY" wipes in, then the page fades up.
 * About 1.5 s in total; click anywhere or press Escape to skip.
 */
export const SiteOpener = () => {
  const [isActive, setIsActive] = useState(shouldPlay);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleClose = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsActive(false);
    }, FADE_MS);
  }, []);

  useEffect(() => {
    if (!isActive) return undefined;
    lockScroll();

    const startTimer = setTimeout(() => setIsRevealing(true), REVEAL_DELAY);
    const exitTimer = setTimeout(handleClose, HOLD_UNTIL);
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(exitTimer);
      window.removeEventListener('keydown', handleKeyDown);
      unlockScroll();
    };
    // Unlocks when the intro finishes (isActive → false); handleClose is stable
  }, [isActive]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isActive) return null;

  return (
    <div
      role="presentation"
      onClick={handleClose}
      className={`fixed inset-0 z-[9999] bg-black dark:bg-[#0a1426] flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none transition-opacity ease-out ${
        isLeaving ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        className="absolute top-6 right-6 sm:top-8 sm:right-10 px-3.5 py-1.5 rounded-full border border-white/15 text-[12px] text-white/60 hover:text-white hover:border-white/40 transition-colors"
      >
        Skip
      </button>

      <div className="relative inline-block overflow-hidden py-2 px-4 text-center">
        <h1
          className={`text-3xl sm:text-5xl md:text-6xl tracking-tight leading-none text-white whitespace-nowrap will-change-[clip-path] ${
            isRevealing ? 'site-opener-line-revealing' : 'clip-path-inset-full'
          }`}
        >
          <span className="text-[#D9C59A] mr-3 sm:mr-4">Welcome to</span>
          <span className="font-semibold tracking-[0.16em]">SYMMETRY</span>
        </h1>
      </div>
      <p
        className={`mt-5 text-[13px] sm:text-[15px] text-white/55 transition-all duration-700 ease-out ${
          isRevealing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        Interior design · Furniture · Turnkey projects
      </p>
    </div>
  );
};

export default SiteOpener;
