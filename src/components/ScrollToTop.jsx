import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { scrollToTarget } from '../lib/scroll';
import { dur, ease } from '../lib/motion';

/** "Back to top" button, shown after the first screen. Page-change scrolling lives in SmoothScroll. */
export const ScrollToTop = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowButton(window.scrollY > 400);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {showButton && (
        <m.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: dur.fast, ease: ease.out }}
          onClick={() => scrollToTarget(0)}
          aria-label="Scroll to top"
          className="fixed bottom-[230px] right-6 sm:bottom-[240px] sm:right-8 z-40 p-3 sm:p-3.5 rounded-full bg-surface/80 backdrop-blur-md border border-line text-fg hover:text-accent hover:border-accent shadow-luxury transition-all duration-300 group"
        >
          <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-1" />
        </m.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
