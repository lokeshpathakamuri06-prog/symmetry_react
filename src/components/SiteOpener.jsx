import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SiteOpener Component
 * Inspired by Yoo Interior (yoointerior.com) - Awwwards winning luxury site opener.
 * Features:
 *  - Fullscreen architectural black curtain
 *  - Travelling edge-light / shadow beam
 *  - Horizontal clip-path typography unmasking (Welcome to SYMMETRY)
 *  - High-end cubic-bezier exit curtain wipe
 *  - Body scroll lock during intro
 *  - Instant skip on click / Escape key
 */
export const SiteOpener = () => {
  const [isActive, setIsActive] = useState(true);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  // Close and unlock scroll
  const handleClose = useCallback(() => {
    if (isLeaving) return;
    setIsLeaving(true);
    setTimeout(() => {
      setIsActive(false);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      if (window.lenis) {
        window.lenis.start();
        window.lenis.resize();
      }
    }, 700);
  }, [isLeaving]);

  useEffect(() => {
    // Lock scroll while opener is active
    if (window.lenis) {
      window.lenis.stop();
    }
    document.body.style.overflow = 'hidden';

    // Start reveal animation on next frame
    const startTimer = setTimeout(() => {
      setIsRevealing(true);
    }, 150);

    // Auto-close after reveal animation completes (reveal 1.25s + pause 0.5s = ~1.9s)
    const exitTimer = setTimeout(() => {
      handleClose();
    }, 2200);

    // Keyboard listener (Escape to skip)
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Optional event to trigger replay
    const handleReplay = () => {
      setIsActive(true);
      setIsLeaving(false);
      setIsRevealing(false);
      if (window.lenis) {
        window.lenis.stop();
      }
      document.body.style.overflow = 'hidden';
      setTimeout(() => setIsRevealing(true), 150);
      setTimeout(() => handleClose(), 2200);
    };
    window.addEventListener('symmetry:replay-opener', handleReplay);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(exitTimer);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('symmetry:replay-opener', handleReplay);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      if (window.lenis) {
        window.lenis.start();
        window.lenis.resize();
      }
    };
  }, [handleClose]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <div
        role="presentation"
        onClick={handleClose}
        className={`fixed inset-0 z-[9999] bg-[#07121C] text-[#F5F1E8] flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none transition-all duration-700 ease-[cubic-bezier(0.72,0,0.18,1)] ${
          isLeaving
            ? 'opacity-0 -translate-y-full pointer-events-none'
            : 'opacity-100 translate-y-0'
        }`}
      >
        {/* Subtle Ambient Vignette & Champagne Radial Light */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(54,101,107,0.18)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(54,101,107,0.08)_1px,transparent_1px)] [background-size:28px_28px] opacity-40" />
        </div>

        {/* Top Floating Badge / Skip Cue */}
        <div className="absolute top-6 sm:top-8 inset-x-6 sm:inset-x-10 flex items-center justify-between text-xs font-mono uppercase tracking-[0.25em] text-[#AEB7BE]/50">
          <span className="hidden sm:inline">HYDERABAD ATELIER &bull; EST. 2026</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="ml-auto px-3 py-1 rounded-full border border-white/10 hover:border-[#36656B]/40 hover:text-white transition-colors cursor-pointer"
          >
            [ Skip Intro &rarr; ]
          </button>
        </div>

        {/* Center Frame: The Signature Yoo Interior Clip-Path Reveal */}
        <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto">
          {/* Main Title Clip Mask Container */}
          <div className="relative inline-block overflow-hidden py-2 px-4">
            <h1
              className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-none text-white whitespace-nowrap will-change-[clip-path] ${
                isRevealing ? 'site-opener-line-revealing' : 'clip-path-inset-full'
              }`}
            >
              <span className="font-serif italic font-light text-[#BCA575] mr-3 sm:mr-4">
                Welcome to
              </span>
              <span className="font-sans font-bold tracking-[0.16em] text-white">
                SYMMETRY
              </span>
            </h1>

            {/* Yoo Interior Signature Travelling Edge Light / Beam */}
            {isRevealing && (
              <span
                className="site-opener-edge-revealing pointer-events-none absolute top-[-20%] bottom-[-20%] w-10 sm:w-16 z-20 bg-gradient-to-r from-transparent via-[#36656B]/80 to-transparent blur-[1px]"
              />
            )}
          </div>

          {/* Subtitle Line Fade-In */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isRevealing ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-xs sm:text-sm md:text-base uppercase tracking-[0.28em] text-[#AEB7BE] font-light"
          >
            Atelier for Architectural Interiors &bull; Bespoke Fitouts
          </motion.p>

          {/* Micro Progress Bar along bottom */}
          <div className="mt-8 w-36 sm:w-48 h-[1.5px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={isRevealing ? { width: '100%' } : { width: '0%' }}
              transition={{ duration: 1.8, ease: 'linear' }}
              className="h-full bg-gradient-to-r from-[#36656B] to-[#E2D2A4]"
            />
          </div>
        </div>

        {/* Bottom Location Indicator */}
        <div className="absolute bottom-6 sm:bottom-8 text-[11px] font-mono uppercase tracking-[0.25em] text-[#AEB7BE]/40">
          <span>Road No. 36, Jubilee Hills</span>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default SiteOpener;
